import { useState } from 'react'
import { Upload as AntUpload, Input, message, Spin } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { submitAnalysis, workTypeLabel, type WorkType } from '../mock/data'
import Seal from '../components/Seal'

const { Dragger } = AntUpload
const { TextArea } = Input

const types: { v: WorkType; en: string }[] = [
  { v: 'text', en: 'TEXTUAL' },
  { v: 'art', en: 'ARTISTIC' },
  { v: 'av', en: 'AUDIOVISUAL' },
]

const acceptMap: Record<WorkType, string> = {
  text: '.txt,.doc,.docx,.pdf',
  art: '.jpg,.jpeg,.png,.webp',
  av: '.mp4,.mov,.mp3,.wav',
}

export default function UploadPage() {
  const navigate = useNavigate()
  const [workType, setWorkType] = useState<WorkType>('text')
  const [loading, setLoading] = useState(false)
  // 受控录入：两侧作品的名称与（文字类）粘贴内容、是否已选文件
  const [names, setNames] = useState({ p: '', d: '' })
  const [texts, setTexts] = useState({ p: '', d: '' })
  const [hasFile, setHasFile] = useState({ p: false, d: false })

  const draggerProps = (side: 'p' | 'd') => ({
    multiple: false,
    accept: acceptMap[workType],
    beforeUpload: () => false as const,
    onChange: () => {
      setHasFile((s) => ({ ...s, [side]: true }))
      message.success('已选择文件（演示：文件未真实上传）')
    },
  })

  /** 每一侧至少要有：作品名称、或已选文件、或（文字类）粘贴内容 */
  function sideReady(side: 'p' | 'd') {
    return (
      names[side].trim() !== '' ||
      hasFile[side] ||
      (workType === 'text' && texts[side].trim() !== '')
    )
  }

  async function handleSubmit() {
    if (!sideReady('p') || !sideReady('d')) {
      message.warning('请先分别录入「原告作品」与「被诉作品」（名称、文件或文本至少其一）')
      return
    }
    setLoading(true)
    try {
      const result = await submitAnalysis({
        workType,
        plaintiff: { name: names.p, text: texts.p },
        defendant: { name: names.d, text: texts.d },
      })
      message.success('研判完成，正在生成档案')
      navigate(`/report/${result.id}`)
    } catch (err) {
      message.error(
        err instanceof Error ? err.message : '研判失败，请确认后端服务已启动',
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Spin spinning={loading} tip="DeepSeek-V4-Flash 正在推理研判，请稍候…" size="large">
      <div className="page-wrap">
        {/* 标题区 */}
        <div className="eyebrow">表单 FORM · 受理登记</div>
        <h1 style={{ fontSize: 'clamp(32px,5vw,52px)', fontWeight: 900, margin: '14px 0 0' }}>
          作品<span style={{ color: 'var(--seal)' }}>上传</span>
        </h1>
        <p style={{ color: 'var(--ink-soft)', maxWidth: 600, marginTop: 14, lineHeight: 1.8 }}>
          分别录入「原告作品」与「被诉作品」，系统将区分通用元素与独创性表达后进行多维比对。
        </p>

        {/* 作品类型选择 —— 自定义分段卡 */}
        <div style={{ margin: '40px 0 28px' }}>
          <div className="label-mono" style={{ marginBottom: 12 }}>
            作品类型 / CATEGORY
          </div>
          <div style={{ display: 'flex', gap: 0, border: '1px solid var(--line)', borderRadius: 2, overflow: 'hidden', maxWidth: 560 }}>
            {types.map((t) => {
              const active = workType === t.v
              return (
                <button
                  key={t.v}
                  onClick={() => setWorkType(t.v)}
                  style={{
                    flex: 1,
                    padding: '16px 8px',
                    cursor: 'pointer',
                    border: 'none',
                    borderRight: '1px solid var(--line)',
                    background: active ? 'var(--ink)' : 'var(--paper-3)',
                    color: active ? 'var(--paper-3)' : 'var(--ink-soft)',
                    transition: 'all .2s',
                  }}
                >
                  <div style={{ fontFamily: 'var(--serif)', fontWeight: 700, fontSize: 17 }}>
                    {workTypeLabel[t.v]}
                  </div>
                  <div
                    className="num"
                    style={{ fontSize: 9.5, letterSpacing: '0.18em', marginTop: 3, opacity: 0.7 }}
                  >
                    {t.en}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* 两栏录入 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 24,
          }}
        >
          {([
            { id: 'p', title: '原告作品', en: 'PLAINTIFF · 甲', tag: '甲' },
            { id: 'd', title: '被诉作品', en: 'DEFENDANT · 乙', tag: '乙' },
          ] as const).map((side) => (
            <div key={side.id} className="paper-card" style={{ padding: 24 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 18,
                  paddingBottom: 14,
                  borderBottom: '1px solid var(--line)',
                }}
              >
                <h3 style={{ fontSize: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Seal text={side.tag} size={26} />
                  {side.title}
                </h3>
                <span className="label-mono" style={{ fontSize: 9.5 }}>
                  {side.en}
                </span>
              </div>

              <Input
                placeholder="作品名称 / 标识"
                style={{ marginBottom: 16 }}
                value={names[side.id]}
                onChange={(e) =>
                  setNames((s) => ({ ...s, [side.id]: e.target.value }))
                }
              />

              <Dragger
                {...draggerProps(side.id)}
                style={{ marginBottom: workType === 'text' ? 16 : 0 }}
              >
                <p style={{ fontSize: 34, color: 'var(--seal)', margin: '6px 0' }}>
                  <InboxOutlined />
                </p>
                <p style={{ fontWeight: 500, color: 'var(--ink)' }}>点击或拖拽文件到此处</p>
                <p className="num" style={{ color: 'var(--muted)', fontSize: 11, letterSpacing: '0.06em' }}>
                  {acceptMap[workType]}
                </p>
              </Dragger>

              {workType === 'text' && (
                <TextArea
                  rows={4}
                  placeholder="也可直接粘贴文本内容…"
                  showCount
                  maxLength={5000}
                  value={texts[side.id]}
                  onChange={(e) =>
                    setTexts((s) => ({ ...s, [side.id]: e.target.value }))
                  }
                />
              )}
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <button
            className="btn-press"
            onClick={handleSubmit}
            disabled={loading}
            style={{
              fontFamily: 'var(--sans)',
              fontWeight: 500,
              fontSize: 15,
              padding: '15px 48px',
              background: 'var(--seal)',
              color: '#fff',
              border: 'none',
              borderRadius: 2,
              cursor: 'pointer',
              letterSpacing: '0.04em',
            }}
          >
            开始研判 →
          </button>
          <div className="label-mono" style={{ marginTop: 14 }}>
            提交后由 DeepSeek-V4-Flash 引擎进行多维相似度推理
          </div>
        </div>
      </div>
    </Spin>
  )
}
