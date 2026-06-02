import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider, theme as antdTheme } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: '#b23a2b',
          colorInfo: '#34525c',
          colorText: '#1c1a16',
          colorBgBase: '#faf7ef',
          borderRadius: 2,
          fontFamily:
            "'Noto Sans SC', system-ui, sans-serif",
          colorBorder: '#d3ccba',
        },
        components: {
          Table: { headerBg: '#ece6d8', borderColor: '#d3ccba' },
          Button: { fontWeight: 500 },
        },
      }}
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ConfigProvider>
  </StrictMode>,
)
