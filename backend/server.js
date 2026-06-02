import express from 'express'
import cors from 'cors'
import 'dotenv/config'

const app = express()
app.use(cors())
app.use(express.json({ limit: '4mb' }))

const API_KEY = process.env.DEEPSEEK_API_KEY
const BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com'
const MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-v4-flash'
const PORT = process.env.PORT || 8787

const typeLabel = { text: '文字作品', art: '美术作品', av: '视听作品' }
const CONCLUSIONS = ['构成实质性相似', '部分相似', '不构成实质性相似']

const SYSTEM_PROMPT = `你是一套「作品实质性相似研判」专家系统，服务于著作权侵权的辅助判定。
请依据以下原则对「原告作品」与「被诉作品」进行比对研判：
1. 思想—表达二分法：只比对受著作权法保护的「独创性表达」，排除思想、通用素材、公有领域元素。
2. 多层级量化：分别给出「表层相似度」「语义/逻辑相似度」「风格相似度」三个维度（0-100 分）。
3. 质与量平衡：综合相似度需兼顾相似内容的数量与质（独创性核心是否被沿用）。
4. 结论只能取三者之一：构成实质性相似 / 部分相似 / 不构成实质性相似。
5. 给出可解释的法律合理性说明（法律—技术双循环验证），客观审慎，并提示最终须结合司法判例与专家评审。

【输出要求】只输出一个 JSON 对象（不要任何解释文字、不要 markdown 代码块），结构如下：
{
  "overallScore": 0-100 的整数,
  "conclusion": "构成实质性相似" | "部分相似" | "不构成实质性相似",
  "dimensions": [
    { "key": "surface",  "label": "表层相似度",      "score": 0-100, "description": "中文说明" },
    { "key": "semantic", "label": "语义/逻辑相似度", "score": 0-100, "description": "中文说明" },
    { "key": "style",    "label": "风格相似度",      "score": 0-100, "description": "中文说明" }
  ],
  "segments": [
    { "id": "s1", "original": "原告作品中的片段", "suspected": "被诉作品中的对应片段", "score": 0-100, "note": "为何相似的研判说明" }
  ],
  "legalNote": "法律合理性说明（中文，120-220字）"
}
说明：segments 为相似片段对照，仅在文字作品且能定位到具体相似片段时给出（最多 5 条）；
若无法定位或非文字作品，segments 返回空数组 []。`

function buildUserPrompt({ workType, plaintiff, defendant }) {
  const label = typeLabel[workType] || '作品'
  return `作品类型：${label}

【原告作品】
名称：${plaintiff.name || '(未命名)'}
内容：
${plaintiff.text || '(未提供文本内容)'}

【被诉作品】
名称：${defendant.name || '(未命名)'}
内容：
${defendant.text || '(未提供文本内容)'}

请据此完成研判并按要求输出 JSON。`
}

const clamp = (n) => {
  const v = Math.round(Number(n))
  if (Number.isNaN(v)) return 0
  return Math.max(0, Math.min(100, v))
}

const deriveConclusion = (score) =>
  score >= 75 ? '构成实质性相似' : score >= 50 ? '部分相似' : '不构成实质性相似'

function nowStamp() {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`
}

/** 把模型返回的 JSON 规范成前端期望的 AnalysisResult */
function normalize(p, { workType, plaintiff, defendant }) {
  const overallScore = clamp(p.overallScore)
  const defaults = [
    { key: 'surface', label: '表层相似度' },
    { key: 'semantic', label: '语义/逻辑相似度' },
    { key: 'style', label: '风格相似度' },
  ]
  const dims = Array.isArray(p.dimensions) ? p.dimensions : []
  const dimensions = defaults.map((d, i) => {
    const m = dims.find((x) => x.key === d.key) || dims[i] || {}
    return {
      key: d.key,
      label: d.label,
      score: clamp(m.score),
      description: String(m.description || ''),
    }
  })
  const segments = (Array.isArray(p.segments) ? p.segments : [])
    .slice(0, 5)
    .map((s, i) => ({
      id: s.id || `s${i + 1}`,
      original: String(s.original || ''),
      suspected: String(s.suspected || ''),
      score: clamp(s.score),
      note: String(s.note || ''),
    }))
  return {
    id: 'R-' + Date.now(),
    workType,
    originalName: plaintiff.name || '原告作品',
    suspectedName: defendant.name || '被诉作品',
    createdAt: nowStamp(),
    overallScore,
    conclusion: CONCLUSIONS.includes(p.conclusion)
      ? p.conclusion
      : deriveConclusion(overallScore),
    dimensions,
    segments,
    legalNote: String(p.legalNote || ''),
  }
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, model: MODEL, hasKey: Boolean(API_KEY) })
})

app.post('/api/analyze', async (req, res) => {
  try {
    if (!API_KEY) {
      return res.status(500).send('后端未配置 DEEPSEEK_API_KEY，请检查 backend/.env')
    }
    const { workType = 'text', plaintiff = {}, defendant = {} } = req.body || {}

    const resp = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: buildUserPrompt({ workType, plaintiff, defendant }) },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
        max_tokens: 4000,
        stream: false,
      }),
    })

    if (!resp.ok) {
      const text = await resp.text().catch(() => '')
      console.error('DeepSeek error', resp.status, text.slice(0, 500))
      return res
        .status(502)
        .send(`DeepSeek 接口错误（${resp.status}）：${text.slice(0, 300)}`)
    }

    const data = await resp.json()
    const content = data?.choices?.[0]?.message?.content || ''
    let parsed
    try {
      parsed = JSON.parse(content)
    } catch {
      console.error('Bad JSON from model:', content.slice(0, 500))
      return res.status(502).send('模型未返回有效 JSON，请重试')
    }

    res.json(normalize(parsed, { workType, plaintiff, defendant }))
  } catch (e) {
    console.error(e)
    res.status(500).send('研判服务异常：' + (e?.message || String(e)))
  }
})

app.listen(PORT, () => {
  console.log(`[研判后端] 已启动 http://localhost:${PORT}  模型=${MODEL}  密钥=${API_KEY ? '已配置' : '未配置'}`)
})
