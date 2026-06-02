import { useEffect, useState } from 'react'
import { Spin, Empty, Select } from 'antd'
import ReactECharts from 'echarts-for-react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  fetchResultById,
  fetchResults,
  workTypeLabel,
  type AnalysisResult,
} from '../mock/data'

const conclusionColor: Record<AnalysisResult['conclusion'], string> = {
  构成实质性相似: '#8d2c20',
  部分相似: '#8a6d1f',
  不构成实质性相似: '#2f5d4a',
}

const INK = '#1c1a16'
const INK_SOFT = '#4a463d'
const SEAL = '#b23a2b'
const LINE = '#d3ccba'

export default function Report() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [options, setOptions] = useState<AnalysisResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    Promise.all([
      fetchResults(),
      id ? fetchResultById(id) : Promise.resolve(undefined),
    ]).then(([all, one]) => {
      setOptions(all)
      setResult(one ?? all[0] ?? null)
      setLoading(false)
    })
  }, [id])

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 120 }}>
        <Spin size="large" />
      </div>
    )
  }
  if (!result) {
    return (
      <div className="page-wrap">
        <Empty description="暂无研判档案，请先上传作品发起研判" />
      </div>
    )
  }

  const radarOption = {
    tooltip: {},
    radar: {
      indicator: result.dimensions.map((d) => ({ name: d.label, max: 100 })),
      radius: '62%',
      axisName: { color: INK_SOFT, fontFamily: 'Noto Sans SC', fontSize: 12 },
      splitLine: { lineStyle: { color: LINE } },
      splitArea: { areaStyle: { color: ['transparent', 'rgba(178,58,43,0.03)'] } },
      axisLine: { lineStyle: { color: LINE } },
    },
    series: [
      {
        type: 'radar',
        symbol: 'circle',
        symbolSize: 5,
        areaStyle: { color: 'rgba(178,58,43,0.18)' },
        lineStyle: { color: SEAL, width: 2 },
        itemStyle: { color: SEAL },
        data: [{ value: result.dimensions.map((d) => d.score), name: '相似度' }],
      },
    ],
  }

  const gaugeOption = {
    series: [
      {
        type: 'gauge',
        startAngle: 210,
        endAngle: -30,
        min: 0,
        max: 100,
        progress: { show: true, width: 14, itemStyle: { color: SEAL } },
        axisLine: { lineStyle: { width: 14, color: [[1, LINE]] } },
        axisTick: { show: false },
        splitLine: { length: 10, lineStyle: { color: LINE } },
        axisLabel: { distance: 18, fontSize: 9, color: '#8c8577', fontFamily: 'JetBrains Mono' },
        pointer: { width: 4, itemStyle: { color: INK } },
        anchor: { show: true, size: 10, itemStyle: { color: INK } },
        detail: {
          valueAnimation: true,
          formatter: '{value}',
          fontSize: 44,
          fontFamily: 'JetBrains Mono',
          fontWeight: 700,
          offsetCenter: [0, '40%'],
          color: INK,
        },
        data: [{ value: result.overallScore }],
      },
    ],
  }

  return (
    <div className="page-wrap">
      {/* 报头 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div className="eyebrow">研判档案 DOSSIER</div>
        <div
          className="no-print report-toolbar"
          style={{ display: 'flex', gap: 12, alignItems: 'center' }}
        >
          <Select
            value={result.id}
            style={{ width: 250 }}
            onChange={(v) => navigate(`/report/${v}`)}
            options={options.map((o) => ({
              value: o.id,
              label: `${o.id} · ${workTypeLabel[o.workType]}`,
            }))}
          />
          <button className="btn-press" onClick={() => window.print()} style={btnGhost}>
            打印 / 导出
          </button>
        </div>
      </div>

      {/* 卷宗头 */}
      <div
        className="case-header"
        style={{
          marginTop: 20,
          padding: '32px 0',
          borderTop: '2px solid var(--ink)',
          borderBottom: '1px solid var(--line)',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: 32,
          alignItems: 'center',
        }}
      >
        <div>
          <div className="num" style={{ color: 'var(--muted)', fontSize: 12, marginBottom: 12 }}>
            {result.id} — {result.createdAt} — {workTypeLabel[result.workType]}
          </div>
          <h1 style={{ fontSize: 'clamp(26px,3.4vw,40px)', lineHeight: 1.25, fontWeight: 900 }}>
            {result.originalName}
          </h1>
          <div
            style={{
              fontFamily: 'var(--mono)',
              color: 'var(--seal)',
              margin: '8px 0',
              fontSize: 13,
              letterSpacing: '0.1em',
            }}
          >
            VS
          </div>
          <h1 style={{ fontSize: 'clamp(26px,3.4vw,40px)', lineHeight: 1.25, fontWeight: 900, color: 'var(--ink-soft)' }}>
            {result.suspectedName}
          </h1>
        </div>

        {/* 结论印章 */}
        <div style={{ textAlign: 'center' }}>
          <div
            className="seal stamp"
            style={{
              width: 150,
              height: 150,
              flexDirection: 'column',
              borderColor: conclusionColor[result.conclusion],
              color: conclusionColor[result.conclusion],
              background: `${conclusionColor[result.conclusion]}10`,
            }}
          >
            <span className="num" style={{ fontSize: 46, fontWeight: 700, transform: 'rotate(6deg)' }}>
              {result.overallScore}
            </span>
            <span style={{ fontSize: 12, marginTop: 2, transform: 'rotate(6deg)', letterSpacing: '0.05em' }}>
              综合相似度
            </span>
          </div>
          <div
            style={{
              marginTop: 16,
              fontFamily: 'var(--serif)',
              fontWeight: 700,
              fontSize: 17,
              color: conclusionColor[result.conclusion],
            }}
          >
            {result.conclusion}
          </div>
        </div>
      </div>

      {/* 图表 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 0,
          borderBottom: '1px solid var(--line)',
        }}
      >
        <ChartCell title="多维相似度雷达" en="RADAR" border>
          <ReactECharts option={radarOption} style={{ height: 300 }} />
        </ChartCell>
        <ChartCell title="综合相似度量表" en="GAUGE">
          <ReactECharts option={gaugeOption} style={{ height: 300 }} />
        </ChartCell>
      </div>

      {/* 维度明细 */}
      <SectionTitle index="I" zh="各维度研判明细" en="Dimensions" />
      {result.dimensions.map((d, i) => (
        <div
          key={d.key}
          style={{
            padding: '22px 0',
            borderTop: i === 0 ? '1px solid var(--line)' : 'none',
            borderBottom: '1px solid var(--line)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <h4 style={{ fontSize: 18 }}>{d.label}</h4>
            <span className="num" style={{ fontSize: 22, fontWeight: 700, color: 'var(--seal)' }}>
              {d.score}
              <span style={{ fontSize: 12, color: 'var(--muted)' }}> /100</span>
            </span>
          </div>
          <div className="bar-track" style={{ margin: '12px 0' }}>
            <div className="bar-fill" style={{ width: `${d.score}%` }} />
          </div>
          <p style={{ color: 'var(--ink-soft)', margin: 0, fontSize: 14, lineHeight: 1.75 }}>
            {d.description}
          </p>
        </div>
      ))}

      {/* 相似片段对照 */}
      <SectionTitle index="II" zh="相似片段对照" en="Evidence" />
      {result.segments.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', border: '1px solid var(--line)' }}>
          <Empty description="未检测到明显的相似片段" />
        </div>
      ) : (
        result.segments.map((s, idx) => (
          <div
            key={s.id}
            className="paper-card"
            style={{ padding: 24, marginBottom: 16 }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <span className="label-mono">证据片段 {String(idx + 1).padStart(2, '0')}</span>
              <span
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 12,
                  fontWeight: 700,
                  color: '#fff',
                  background: 'var(--seal)',
                  padding: '3px 10px',
                  borderRadius: 2,
                }}
              >
                {s.score}% 相似
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px,1fr))', gap: 16 }}>
              <Excerpt tag="甲 · 原告" text={s.original} />
              <Excerpt tag="乙 · 被诉" text={s.suspected} seal />
            </div>
            <p style={{ margin: '14px 0 0', color: 'var(--ink-soft)', fontSize: 13.5, lineHeight: 1.7 }}>
              <span className="label-mono" style={{ color: 'var(--seal)' }}>研判 · </span>
              {s.note}
            </p>
          </div>
        ))
      )}

      {/* 法律说明 */}
      <SectionTitle index="III" zh="法律合理性说明" en="Legal Basis" />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 200px) 1fr',
          gap: 0,
          border: '1px solid var(--line)',
          borderLeft: '3px solid var(--seal)',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <div className="duotone report-aside" style={{ minHeight: 220 }}>
          <img src="/img/report.jpg" alt="古籍卷宗" />
        </div>
        <div style={{ padding: '24px 26px', background: 'var(--seal-wash)' }}>
          <div className="label-mono" style={{ color: 'var(--seal)', marginBottom: 10 }}>
            法律—技术双循环验证
          </div>
          <p style={{ margin: 0, lineHeight: 1.9, color: 'var(--ink)', fontSize: 14.5 }}>
            {result.legalNote}
          </p>
        </div>
      </div>

      <p style={{ marginTop: 28, color: 'var(--muted)', fontSize: 12, lineHeight: 1.7 }}>
        ＊ 本档案由系统基于多层级相似度量化模型自动生成，结论仅供参考；最终认定须结合司法判例回溯
        与专家评审，遵循“质与量平衡”原则。
      </p>
    </div>
  )
}

function ChartCell({
  title,
  en,
  children,
  border,
}: {
  title: string
  en: string
  children: React.ReactNode
  border?: boolean
}) {
  return (
    <div
      style={{
        padding: '24px 20px',
        borderTop: '1px solid var(--line)',
        borderRight: border ? '1px solid var(--line)' : 'none',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <h4 style={{ fontSize: 16 }}>{title}</h4>
        <span className="label-mono" style={{ fontSize: 10 }}>{en}</span>
      </div>
      {children}
    </div>
  )
}

function Excerpt({ tag, text, seal }: { tag: string; text: string; seal?: boolean }) {
  return (
    <div
      style={{
        padding: '16px 18px',
        background: seal ? 'rgba(178,58,43,0.05)' : 'var(--paper)',
        border: '1px solid var(--line)',
        borderRadius: 2,
      }}
    >
      <div className="label-mono" style={{ marginBottom: 10, color: seal ? 'var(--seal)' : 'var(--muted)' }}>
        {tag}
      </div>
      <p style={{ margin: 0, lineHeight: 1.85, fontSize: 14.5, color: 'var(--ink)' }}>{text}</p>
    </div>
  )
}

function SectionTitle({ index, zh, en }: { index: string; zh: string; en: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, margin: '56px 0 8px' }}>
      <span className="num" style={{ color: 'var(--seal)', fontSize: 13, fontWeight: 700 }}>
        §{index}
      </span>
      <h2 style={{ fontSize: 24 }}>{zh}</h2>
      <span className="label-mono" style={{ marginLeft: 'auto' }}>{en}</span>
    </div>
  )
}

const btnGhost: React.CSSProperties = {
  fontFamily: 'var(--sans)',
  fontWeight: 500,
  fontSize: 13,
  padding: '8px 18px',
  background: 'transparent',
  color: 'var(--ink)',
  border: '1px solid var(--ink)',
  borderRadius: 2,
  cursor: 'pointer',
}
