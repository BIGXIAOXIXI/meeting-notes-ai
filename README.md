# meeting-notes-ai

把凌乱的会议/课堂记录整理成**纪要 + 行动项**。

## 本地运行
1. 复制 `.env`，填入 `DEEPSEEK_API_KEY=你的Key`
2. `npm install`
3. `node server.js`
4. 浏览器打开 http://localhost:3000

## 说明
- Key 只放在本机 `.env`，已在 `.gitignore`，不会上传 GitHub。
- 浏览器只请求本机 `/api/summarize`，由 Node 转发 DeepSeek。
