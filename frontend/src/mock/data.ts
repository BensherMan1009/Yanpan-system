// ============================================================================
//  数据层 / Data layer
//  · RESULTS 为内置示例档案（历史记录展示用）。
//  · submitAnalysis() 已接入真实后端：POST /api/analyze → 后端调用
//    DeepSeek-V4-Flash 返回结构化研判结果。
//  · 真实研判结果会写入会话级 liveResults，供列表页与报告页读取。
// ============================================================================

export type WorkType = 'text' | 'art' | 'av'

export const workTypeLabel: Record<WorkType, string> = {
  text: '文字作品',
  art: '美术作品',
  av: '视听作品',
}

/** 单个相似度维度（表层 / 语义逻辑 / 风格） */
export interface SimilarityDimension {
  key: string
  label: string
  score: number // 0-100
  description: string
}

/** 一段被判定为相似的片段对照 */
export interface SimilarSegment {
  id: string
  original: string
  suspected: string
  score: number // 0-100
  note: string
}

/** 一次完整的研判结果 */
export interface AnalysisResult {
  id: string
  workType: WorkType
  originalName: string
  suspectedName: string
  createdAt: string
  overallScore: number // 0-100 综合相似度
  conclusion: '构成实质性相似' | '部分相似' | '不构成实质性相似'
  dimensions: SimilarityDimension[]
  segments: SimilarSegment[]
  legalNote: string // 法律合理性说明
}

/** 历史研判任务（用于结果列表页） */
const RESULTS: AnalysisResult[] = [
  {
    id: 'R-20260530-001',
    workType: 'text',
    originalName: '《山海旧梦》（原告作品）',
    suspectedName: '《海上旧梦》（被诉作品）',
    createdAt: '2026-05-30 14:22',
    overallScore: 82,
    conclusion: '构成实质性相似',
    dimensions: [
      {
        key: 'surface',
        label: '表层相似度',
        score: 76,
        description: '检测到多处连续文本片段高度重合，适用于直接复制行为的快速识别。',
      },
      {
        key: 'semantic',
        label: '语义/逻辑相似度',
        score: 88,
        description: '通过 NLP 与知识图谱提取核心表达逻辑，情节走向与人物关系高度一致。',
      },
      {
        key: 'style',
        label: '风格相似度',
        score: 81,
        description: '深度学习模型捕捉到叙事节奏、用词习惯等抽象表达特征趋同。',
      },
    ],
    segments: [
      {
        id: 's1',
        original:
          '暮色像潮水一样涌上礁石，他独自坐在灯塔下，等一艘永远不会回来的船。',
        suspected:
          '夜色如潮水般漫过礁石，他一个人坐在灯塔旁，守着一艘再也不会归来的船。',
        score: 91,
        note: '句式结构、意象与情感表达几乎一致，仅作同义词替换。',
      },
      {
        id: 's2',
        original: '她把信纸折成纸船，放进海里，仿佛这样思念就能漂到对岸。',
        suspected: '她将信纸叠成小船，推入海中，好像思念便会顺着海水漂向远方。',
        score: 85,
        note: '核心独创性表达（折信为船寄托思念）被完整沿用。',
      },
      {
        id: 's3',
        original: '灯塔的光一圈一圈转，像在数着没有尽头的夜。',
        suspected: '灯塔的光束一遍遍旋转，仿佛在清点无穷无尽的黑夜。',
        score: 78,
        note: '比喻手法与画面构造相同，属于独创性表达层面的相似。',
      },
    ],
    legalNote:
      '依据"思想-表达二分法"，比对聚焦于独创性表达而非通用素材。综合表层、语义与风格三个维度，且关键独创性片段被实质性沿用，结合"质与量平衡"原则，倾向认定构成实质性相似。最终结论仍需结合司法判例与专家评审确认。',
  },
  {
    id: 'R-20260529-007',
    workType: 'art',
    originalName: '插画《极昼之城》（原告作品）',
    suspectedName: '海报《白夜之都》（被诉作品）',
    createdAt: '2026-05-29 09:48',
    overallScore: 64,
    conclusion: '部分相似',
    dimensions: [
      {
        key: 'surface',
        label: '表层相似度',
        score: 58,
        description: '图像哈希与特征匹配显示主体轮廓相近，但局部细节存在差异。',
      },
      {
        key: 'semantic',
        label: '语义/逻辑相似度',
        score: 62,
        description: '核心视觉元素（构图与布局、主题）部分重合。',
      },
      {
        key: 'style',
        label: '风格相似度',
        score: 71,
        description: '色彩与色调、笔触与技法呈现相近的风格流派特征。',
      },
    ],
    segments: [
      {
        id: 's1',
        original: '主视觉：冷蓝色调下的悬浮城市，左下角放射状光束构图。',
        suspected: '主视觉：冷蓝紫色调的空中之城，左下角同样为放射状光束。',
        score: 73,
        note: '构图与色调高度接近，但建筑细节、人物元素不同。',
      },
    ],
    legalNote:
      '美术作品的构图与色调属于较易趋同的表达层面，需区分"公有领域通用元素"与"独创性表达"。当前重合主要集中在风格层面，独创性核心元素差异明显，倾向认定为部分相似，建议结合人工评审进一步判断。',
  },
  {
    id: 'R-20260528-013',
    workType: 'av',
    originalName: '短片《回声》（原告作品）',
    suspectedName: '短片《余响》（被诉作品）',
    createdAt: '2026-05-28 17:05',
    overallScore: 38,
    conclusion: '不构成实质性相似',
    dimensions: [
      {
        key: 'surface',
        label: '表层相似度',
        score: 22,
        description: '关键帧提取与匹配未发现明显画面重合，时序特征差异大。',
      },
      {
        key: 'semantic',
        label: '语义/逻辑相似度',
        score: 45,
        description: '剧本与字幕的情节结构相似性中等，属常见叙事母题。',
      },
      {
        key: 'style',
        label: '风格相似度',
        score: 47,
        description: '音频指纹与旋律对比未见实质重合，整体风格相近但非沿用。',
      },
    ],
    segments: [],
    legalNote:
      '两部作品在题材上同属"寻找与告别"母题，属思想层面的通用元素，不受著作权法保护。技术指标在各维度均处于较低水平，倾向认定不构成实质性相似。',
  },
]

/** 模拟网络延迟 */
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

// ---- 会话级真实研判结果存储（刷新后仍在，关闭标签页清空） ----
const LIVE_KEY = 'live_results'
function loadLive(): AnalysisResult[] {
  try {
    return JSON.parse(sessionStorage.getItem(LIVE_KEY) || '[]')
  } catch {
    return []
  }
}
function saveLive(r: AnalysisResult) {
  const arr = loadLive()
  arr.unshift(r)
  sessionStorage.setItem(LIVE_KEY, JSON.stringify(arr))
}

/** 获取研判结果列表（真实结果在前，内置示例在后） */
export async function fetchResults(): Promise<AnalysisResult[]> {
  await delay(200)
  return [...loadLive(), ...RESULTS]
}

/** 按 id 获取单条研判详情 */
export async function fetchResultById(
  id: string,
): Promise<AnalysisResult | undefined> {
  await delay(120)
  return loadLive().find((r) => r.id === id) ?? RESULTS.find((r) => r.id === id)
}

/** 一侧作品录入 */
export interface WorkInput {
  name: string
  text: string
}

/** 提交作品发起研判：调用后端 → DeepSeek-V4-Flash */
export async function submitAnalysis(payload: {
  workType: WorkType
  plaintiff: WorkInput
  defendant: WorkInput
}): Promise<AnalysisResult> {
  const res = await fetch('/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`研判服务返回错误（${res.status}）。${detail}`)
  }
  const result = (await res.json()) as AnalysisResult
  saveLive(result)
  return result
}
