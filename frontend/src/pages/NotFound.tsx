import { useNavigate } from 'react-router-dom'
import Seal from '../components/Seal'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div
      className="page-wrap"
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      <Seal text="无此卷" size={96} rotate={-8} />
      <div
        className="num"
        style={{ fontSize: 64, fontWeight: 700, color: 'var(--ink)', marginTop: 28 }}
      >
        404
      </div>
      <h2 style={{ fontSize: 24, margin: '6px 0 10px' }}>未找到该页面</h2>
      <p style={{ color: 'var(--ink-soft)', maxWidth: 420, lineHeight: 1.8 }}>
        你访问的档案不存在，或链接已失效。请返回首页重新进入研判流程。
      </p>
      <button
        className="btn-press"
        onClick={() => navigate('/')}
        style={{
          marginTop: 24,
          fontFamily: 'var(--sans)',
          fontWeight: 500,
          fontSize: 14,
          padding: '13px 28px',
          background: 'var(--ink)',
          color: 'var(--paper-3)',
          border: 'none',
          borderRadius: 2,
          cursor: 'pointer',
        }}
      >
        返回首页 →
      </button>
    </div>
  )
}
