import type { CSSProperties } from 'react'

interface SealProps {
  /** 印章文字，如「研判」「甲」「乙」「研」 */
  text: string
  /** 印章高度（px），宽度自适应文字 */
  size?: number
  /** 可选副标，如「V4」 */
  sub?: string
  /** 旋转角度 */
  rotate?: number
  /** 覆盖印色（默认朱砂） */
  color?: string
  /** 盖章入场动画 */
  animate?: boolean
  className?: string
  style?: CSSProperties
}

/**
 * 统一印章组件 —— 全站唯一的「印章」视觉来源。
 * 关键点：font-size 随 size 缩放 + white-space:nowrap，保证文字永远单行、
 * 在任意尺寸下风格一致（顶栏小印章与首页大印章完全同源）。
 */
export default function Seal({
  text,
  size = 40,
  sub,
  rotate = -6,
  color,
  animate,
  className = '',
  style,
}: SealProps) {
  const seal = color ?? 'var(--seal)'
  const fontSize = Math.round(size * (sub ? 0.3 : 0.4))

  return (
    <span
      className={`seal-mark ${animate ? 'stamp' : ''} ${className}`}
      style={{
        height: size,
        minWidth: size,
        padding: `0 ${Math.round(size * 0.18)}px`,
        borderWidth: Math.max(1.5, size * 0.055),
        borderColor: seal,
        color: seal,
        background: color ? `${color}12` : 'var(--seal-wash)',
        transform: `rotate(${rotate}deg)`,
        ...style,
      }}
    >
      <span
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          lineHeight: 1,
        }}
      >
        <span
          style={{
            fontSize,
            fontWeight: 900,
            letterSpacing: '0.06em',
            whiteSpace: 'nowrap',
          }}
        >
          {text}
        </span>
        {sub && (
          <span
            style={{
              fontFamily: 'var(--mono)',
              fontSize: Math.round(size * 0.12),
              letterSpacing: '0.22em',
              marginTop: Math.round(size * 0.07),
              whiteSpace: 'nowrap',
            }}
          >
            {sub}
          </span>
        )}
      </span>
    </span>
  )
}
