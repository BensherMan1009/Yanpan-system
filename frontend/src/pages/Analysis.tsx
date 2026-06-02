import { useEffect, useState } from 'react'
import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useNavigate } from 'react-router-dom'
import { fetchResults, workTypeLabel, type AnalysisResult } from '../mock/data'

const conclusionStyle: Record<
  AnalysisResult['conclusion'],
  { color: string; bg: string }
> = {
  构成实质性相似: { color: '#8d2c20', bg: 'rgba(178,58,43,0.12)' },
  部分相似: { color: '#8a6d1f', bg: 'rgba(176,138,40,0.14)' },
  不构成实质性相似: { color: '#2f5d4a', bg: 'rgba(47,93,74,0.12)' },
}

function ScoreBar({ score }: { score: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 130 }}>
      <span className="num" style={{ fontSize: 15, fontWeight: 700, width: 34 }}>
        {score}
      </span>
      <div className="bar-track" style={{ flex: 1 }}>
        <div className="bar-fill" style={{ width: `${score}%` }} />
      </div>
    </div>
  )
}

export default function Analysis() {
  const navigate = useNavigate()
  const [data, setData] = useState<AnalysisResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchResults().then((res) => {
      setData(res)
      setLoading(false)
    })
  }, [])

  const columns: ColumnsType<AnalysisResult> = [
    {
      title: '档案编号',
      dataIndex: 'id',
      key: 'id',
      render: (id: string) => (
        <span className="num" style={{ fontSize: 12.5, color: 'var(--ink-soft)' }}>{id}</span>
      ),
    },
    {
      title: '类型',
      dataIndex: 'workType',
      key: 'workType',
      filters: [
        { text: '文字作品', value: 'text' },
        { text: '美术作品', value: 'art' },
        { text: '视听作品', value: 'av' },
      ],
      onFilter: (value, record) => record.workType === value,
      render: (t: AnalysisResult['workType']) => (
        <span className="label-mono" style={{ fontSize: 11, color: 'var(--ink)' }}>
          {workTypeLabel[t]}
        </span>
      ),
    },
    {
      title: '比对作品',
      key: 'works',
      render: (_, r) => (
        <div style={{ lineHeight: 1.5 }}>
          <div style={{ fontWeight: 500 }}>{r.originalName}</div>
          <div style={{ color: 'var(--muted)', fontSize: 13 }}>诉 / {r.suspectedName}</div>
        </div>
      ),
    },
    {
      title: '综合相似度',
      dataIndex: 'overallScore',
      key: 'overallScore',
      sorter: (a, b) => a.overallScore - b.overallScore,
      defaultSortOrder: 'descend',
      render: (score: number) => <ScoreBar score={score} />,
    },
    {
      title: '研判结论',
      dataIndex: 'conclusion',
      key: 'conclusion',
      render: (c: AnalysisResult['conclusion']) => {
        const s = conclusionStyle[c]
        return (
          <span
            style={{
              fontSize: 12.5,
              fontWeight: 500,
              padding: '4px 10px',
              borderRadius: 2,
              color: s.color,
              background: s.bg,
              border: `1px solid ${s.color}33`,
              whiteSpace: 'nowrap',
            }}
          >
            {c}
          </span>
        )
      },
    },
    {
      title: '时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (t: string) => (
        <span className="num" style={{ fontSize: 12, color: 'var(--muted)' }}>{t}</span>
      ),
    },
    {
      title: '',
      key: 'action',
      render: (_, r) => (
        <span
          onClick={() => navigate(`/report/${r.id}`)}
          style={{
            fontFamily: 'var(--mono)',
            fontSize: 11,
            letterSpacing: '0.1em',
            color: 'var(--seal)',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          查看 →
        </span>
      ),
    },
  ]

  return (
    <div className="page-wrap">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          gap: 16,
          paddingBottom: 24,
          borderBottom: '1px solid var(--line)',
        }}
      >
        <div>
          <div className="eyebrow">案卷 DOCKET · 历史记录</div>
          <h1 style={{ fontSize: 'clamp(32px,5vw,52px)', fontWeight: 900, margin: '12px 0 0' }}>
            研判<span style={{ color: 'var(--seal)' }}>档案</span>
          </h1>
        </div>
        <button
          onClick={() => navigate('/upload')}
          style={{
            fontFamily: 'var(--sans)',
            fontWeight: 500,
            fontSize: 14,
            padding: '12px 22px',
            background: 'var(--ink)',
            color: 'var(--paper-3)',
            border: 'none',
            borderRadius: 2,
            cursor: 'pointer',
          }}
        >
          ＋ 新建研判
        </button>
      </div>

      <div style={{ marginTop: 28 }}>
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 8 }}
          onRow={(r) => ({
            onClick: () => navigate(`/report/${r.id}`),
            style: { cursor: 'pointer' },
          })}
        />
      </div>
    </div>
  )
}
