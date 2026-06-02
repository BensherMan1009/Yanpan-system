# 作品实质性相似研判系统

基于 **DeepSeek-V4-Flash** 的作品实质性相似研判系统，面向文字、美术、视听三类作品，
依循「思想—表达二分法」与多层级相似度量化模型，在表层、语义逻辑、风格三个维度给出
可解释的研判，辅助著作权侵权判定。

## 技术栈

- **前端** `frontend/`：Vite + React 19 + TypeScript + Ant Design 5 + ECharts
- **后端** `backend/`：Node + Express，调用 DeepSeek-V4-Flash（OpenAI 兼容接口）

## 本地运行

需要同时启动后端与前端（两个终端）。

### 1. 后端

```bash
cd backend
npm install
cp .env.example .env      # 然后在 .env 中填入你的 DeepSeek API Key
npm start                 # 启动于 http://localhost:8787
```

### 2. 前端

```bash
cd frontend
npm install
npm run dev               # 启动于 http://localhost:5173
```

浏览器打开 http://localhost:5173 即可使用。前端 `/api` 请求经 Vite 代理转发到后端，
密钥仅保存在后端 `.env`，不会进入前端代码。

## 部署

- 前端可部署到 Netlify（base 目录 `frontend`，构建命令 `npm run build`，发布目录 `frontend/dist`）。
- 后端需单独部署（如 Render / Railway / 云服务器），并在其环境变量中配置 `DEEPSEEK_API_KEY`；
  前端通过环境变量或代理指向后端地址。

## 安全

- **切勿提交 `backend/.env` 或任何包含 API Key 的文件**（已在 `.gitignore` 中忽略）。
- 若密钥曾经泄露，请到 DeepSeek 控制台轮换。
