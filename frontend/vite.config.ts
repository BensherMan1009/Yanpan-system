import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 本地开发请用 `netlify dev`（而非 `vite`）：它会同时运行前端、Netlify Function，
// 并把 /api/analyze 转发到 function（与线上行为一致）。
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
