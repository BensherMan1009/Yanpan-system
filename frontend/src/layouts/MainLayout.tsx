import { NavLink, Outlet } from 'react-router-dom'
import Seal from '../components/Seal'

const nav = [
  { to: '/', label: '首页', en: 'Index', end: true },
  { to: '/upload', label: '作品上传', en: 'Submit' },
  { to: '/analysis', label: '研判结果', en: 'Docket' },
  { to: '/report', label: '比对报告', en: 'Dossier' },
]

export default function MainLayout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 全站极淡水墨/书法背景纹理 */}
      <div className="bg-wash" style={{ backgroundImage: 'url(/img/texture.jpg)' }} />

      {/* 报头 masthead */}
      <header
        className="no-print"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(236, 230, 216, 0.88)',
          backdropFilter: 'saturate(140%) blur(8px)',
          borderBottom: '1px solid var(--line)',
        }}
      >
        <div
          className="header-inner"
          style={{
            maxWidth: 1180,
            margin: '0 auto',
            padding: '0 32px',
            height: 68,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 24,
          }}
        >
          <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Seal text="研判" size={38} />
            <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
              <span style={{ fontFamily: 'var(--serif)', fontWeight: 900, fontSize: 18 }}>
                作品实质性相似研判系统
              </span>
              <span
                className="label-mono header-brand-sub"
                style={{ fontSize: 9.5, letterSpacing: '0.22em' }}
              >
                SUBSTANTIAL SIMILARITY · DEEPSEEK-V4-FLASH
              </span>
            </span>
          </NavLink>

          <nav className="header-nav" style={{ display: 'flex', gap: 4 }}>
            {nav.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                style={({ isActive }) => ({
                  fontFamily: 'var(--mono)',
                  fontSize: 11,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  padding: '8px 14px',
                  borderRadius: 2,
                  color: isActive ? 'var(--seal)' : 'var(--ink-soft)',
                  borderBottom: isActive
                    ? '2px solid var(--seal)'
                    : '2px solid transparent',
                  transition: 'color .2s',
                })}
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* 页脚 */}
      <footer
        className="no-print"
        style={{ borderTop: '1px solid var(--line)', background: 'var(--paper)' }}
      >
        <div
          style={{
            maxWidth: 1180,
            margin: '0 auto',
            padding: '28px 32px',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            color: 'var(--muted)',
            fontSize: 12,
          }}
        >
          <span className="num">© 2026 作品实质性相似研判系统</span>
          <span className="label-mono">
            演示版 · 示例数据 · 非真实研判结论
          </span>
        </div>
      </footer>
    </div>
  )
}
