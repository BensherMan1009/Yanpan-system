# 作品实质性相似研判系统

基于 **DeepSeek-V4-Flash** 的作品实质性相似研判系统，面向文字、美术、视听三类作品，
依循「思想—表达二分法」与多层级相似度量化模型，在表层、语义逻辑、风格三个维度给出
可解释的研判，辅助著作权侵权判定。

## 技术栈

- **前端** `frontend/`：Vite + React 19 + TypeScript + Ant Design 5 + ECharts
- **后端**：Netlify Function `frontend/netlify/functions/analyze.mjs`（serverless），
  调用 DeepSeek-V4-Flash（OpenAI 兼容接口）。密钥仅存于服务端环境变量，不进前端打包。

前端 `/api/analyze` 经 `netlify.toml` 重定向到该 Function；本地与线上行为一致。

## 本地运行

```bash
npm i -g netlify-cli            # 首次需安装 Netlify CLI
cd frontend
npm install
cp .env.example .env           # 在 .env 中填入你的 DeepSeek API Key
netlify dev                    # 一条命令同时跑前端 + Function，默认 http://localhost:8888
```

浏览器打开 `netlify dev` 提示的地址即可使用。密钥只在本地 `.env`（已忽略）/ 线上环境变量中，
绝不会进入前端代码。

## 部署到 Netlify

1. Netlify → **Add new site → Import an existing project**，连接 GitHub 选本仓库。
2. 构建设置：**Base directory = `frontend`**（Build command `npm run build`、Publish `dist`
   会由 `frontend/netlify.toml` 提供）。
3. **Site configuration → Environment variables** 添加：
   - `DEEPSEEK_API_KEY = <你的密钥>`（可选 `DEEPSEEK_MODEL = deepseek-v4-flash`）。
4. Deploy。完成后访问分配的网址即可，`/api/analyze` 自动走 serverless Function。

> 说明：Netlify 同步 Function 默认约 10 秒超时，DeepSeek 调用通常约 6 秒；超长文本可能逼近上限。

## 安全

- **切勿提交 `.env` 或任何含 API Key 的文件**（已在 `.gitignore` 忽略；仅提交 `.env.example` 模板）。
- 密钥泄露请到 DeepSeek 控制台轮换。
