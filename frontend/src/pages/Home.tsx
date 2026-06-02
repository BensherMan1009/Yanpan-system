import { useNavigate } from 'react-router-dom'
import Seal from '../components/Seal'

const works = [
  {
    no: '01',
    title: '文字作品',
    en: 'Textual Works',
    img: '/img/cat-text.jpg',
    desc: '文本查重与抄袭检测 · 语义相似度计算 · 情节与人物关系比对 · 文体与风格检测。',
  },
  {
    no: '02',
    title: '美术作品',
    en: 'Artistic Works',
    img: '/img/cat-art.jpg',
    desc: '视觉特征分析 · 核心视觉元素对比 · 主题与符号识别 · 图像哈希与特征匹配。',
  },
  {
    no: '03',
    title: '视听作品',
    en: 'Audiovisual Works',
    img: '/img/cat-av.jpg',
    desc: '关键帧提取与匹配 · 音频指纹分析 · 剧本与字幕情节结构相似性检测。',
  },
]

const levels = [
  { k: '表层相似度', d: '适用于直接复制行为的快速识别。', tag: 'SURFACE' },
  {
    k: '语义 / 逻辑相似度',
    d: '通过自然语言处理（NLP）与知识图谱技术提取核心表达逻辑。',
    tag: 'SEMANTIC',
  },
  {
    k: '风格相似度',
    d: '利用深度学习模型捕捉作品的抽象表达特征。',
    tag: 'STYLE',
  },
]

const flow = [
  ['壹', '上传作品', '录入原告作品与被诉作品'],
  ['贰', '特征解构', '区分通用元素与独创性表达'],
  ['叁', '多维比对', '表层 / 语义 / 风格三维量化'],
  ['肆', '双循环验证', '法律合理性 + 技术可靠性'],
  ['伍', '生成报告', '导出可解释的研判档案'],
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="page-wrap">
      {/* ───── Hero ───── */}
      <section
        className="hero-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: 40,
          alignItems: 'start',
          paddingBottom: 40,
          borderBottom: '1px solid var(--line)',
        }}
      >
        <div>
          <div className="eyebrow rise" style={{ animationDelay: '0s' }}>
            档案 No. 2026 — 著作权侵权辅助判定
          </div>
          <h1
            className="rise"
            style={{
              animationDelay: '.08s',
              fontSize: 'clamp(38px, 6vw, 68px)',
              fontWeight: 900,
              lineHeight: 1.08,
              margin: '20px 0 0',
            }}
          >
            实质性相似
            <br />
            <span style={{ color: 'var(--seal)' }}>研</span>判系统
          </h1>
          <p
            className="rise"
            style={{
              animationDelay: '.16s',
              maxWidth: 540,
              marginTop: 24,
              fontSize: 16,
              lineHeight: 1.85,
              color: 'var(--ink-soft)',
            }}
          >
            面向文字、美术、视听三类作品，依循“思想—表达二分法”原则与多层级相似度量化模型，
            在表层、语义逻辑与风格三个维度给出可解释的研判，辅助著作权侵权判定。
          </p>
          <div
            className="rise"
            style={{ animationDelay: '.24s', display: 'flex', gap: 14, marginTop: 32 }}
          >
            <button className="btn-press" onClick={() => navigate('/upload')} style={btnPrimary}>
              发起研判 →
            </button>
            <button className="btn-press" onClick={() => navigate('/analysis')} style={btnGhost}>
              查看研判档案
            </button>
          </div>
        </div>

        {/* 水墨大图 + 印章 */}
        <aside className="hero-aside" style={{ position: 'relative', width: 300 }}>
          <div
            className="duotone rise"
            style={{
              animationDelay: '.2s',
              width: '100%',
              height: 380,
              border: '1px solid var(--line)',
            }}
          >
            <img src="/img/hero.jpg" alt="水墨意象" />
          </div>
          <Seal
            text="研判"
            sub="V4"
            size={118}
            animate
            style={{
              position: 'absolute',
              left: -26,
              bottom: 44,
              background: 'var(--paper-3)',
              boxShadow: '0 10px 28px rgba(28,26,22,0.22)',
            }}
          />
          <div
            className="label-mono"
            style={{ marginTop: 16, textAlign: 'right', fontSize: 10, lineHeight: 1.9 }}
          >
            DEEPSEEK-V4-FLASH · ADJUDICATION ENGINE
          </div>
        </aside>
      </section>

      {/* ───── 作品类型 ───── */}
      <SectionTitle index="I" zh="支持的作品类型" en="Categories of Works" />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          borderTop: '1px solid var(--line)',
          borderLeft: '1px solid var(--line)',
        }}
      >
        {works.map((w) => (
          <article
            key={w.no}
            className="hover-card work-card"
            style={{
              borderRight: '1px solid var(--line)',
              borderBottom: '1px solid var(--line)',
              background: 'var(--paper-3)',
            }}
          >
            <div className="duotone work-card-img" style={{ height: 150 }}>
              <img src={w.img} alt={w.title} />
            </div>
            <div style={{ padding: '20px 26px 30px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <span
                  className="num"
                  style={{ fontSize: 13, color: 'var(--seal)', fontWeight: 700 }}
                >
                  {w.no}
                </span>
                <span className="label-mono" style={{ fontSize: 9.5 }}>
                  {w.en}
                </span>
              </div>
              <h3 style={{ fontSize: 24, margin: '12px 0 10px' }}>{w.title}</h3>
              <p style={{ color: 'var(--ink-soft)', fontSize: 14, lineHeight: 1.8, margin: 0 }}>
                {w.desc}
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* ───── 多层级模型 ───── */}
      <SectionTitle index="II" zh="多层级相似度量化模型" en="Multi-Level Model" />
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {levels.map((l, i) => (
          <div
            key={l.k}
            style={{
              display: 'grid',
              gridTemplateColumns: '80px 1fr',
              gap: 24,
              alignItems: 'center',
              padding: '24px 4px',
              borderTop: i === 0 ? '1px solid var(--line)' : 'none',
              borderBottom: '1px solid var(--line)',
            }}
          >
            <span className="label-mono" style={{ fontSize: 10 }}>
              {l.tag}
            </span>
            <div>
              <h4 style={{ fontSize: 19, marginBottom: 4 }}>{l.k}</h4>
              <p style={{ color: 'var(--ink-soft)', margin: 0, fontSize: 14.5 }}>{l.d}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ───── 研判流程 ───── */}
      <SectionTitle index="III" zh="研判流程" en="Procedure" />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 0,
        }}
      >
        {flow.map(([num, t, d], i) => (
          <div
            key={t}
            style={{
              padding: '22px 20px',
              borderTop: '1px solid var(--line)',
              borderRight: i < flow.length - 1 ? '1px solid var(--line)' : 'none',
              position: 'relative',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--serif)',
                fontSize: 30,
                fontWeight: 900,
                color: 'var(--seal)',
              }}
            >
              {num}
            </span>
            <h5 style={{ fontSize: 16, margin: '8px 0 4px' }}>{t}</h5>
            <p style={{ color: 'var(--muted)', fontSize: 12.5, margin: 0, lineHeight: 1.6 }}>
              {d}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

function SectionTitle({ index, zh, en }: { index: string; zh: string; en: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 14,
        margin: '64px 0 8px',
      }}
    >
      <span className="num" style={{ color: 'var(--seal)', fontSize: 13, fontWeight: 700 }}>
        §{index}
      </span>
      <h2 style={{ fontSize: 26 }}>{zh}</h2>
      <span className="label-mono" style={{ marginLeft: 'auto' }}>
        {en}
      </span>
    </div>
  )
}

const btnPrimary: React.CSSProperties = {
  fontFamily: 'var(--sans)',
  fontWeight: 500,
  fontSize: 14,
  padding: '13px 26px',
  background: 'var(--ink)',
  color: 'var(--paper-3)',
  border: 'none',
  borderRadius: 2,
  cursor: 'pointer',
}

const btnGhost: React.CSSProperties = {
  fontFamily: 'var(--sans)',
  fontWeight: 500,
  fontSize: 14,
  padding: '13px 24px',
  background: 'transparent',
  color: 'var(--ink)',
  border: '1px solid var(--ink)',
  borderRadius: 2,
  cursor: 'pointer',
}
