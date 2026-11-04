# meeting-notes-ai

把凌乱的会议/课堂记录整理成**纪要 + 行动项**。

给开完会或下完课懒得整理的人用。

## 本地运行
1. 安装 [Node.js LTS](https://nodejs.org/)
2. 进入本目录，执行：`npm install`
3. 新建 `.env`，写入一行：`DEEPSEEK_API_KEY=你的Key`
4. 运行：`node server.js`
5. 浏览器打开：http://localhost:3000  
   粘贴记录 → 点「生成纪要」

## 说明
- Key 只放本机 `.env`，已在 `.gitignore`，不要提交到 GitHub
- 网页只请求本机 `/api/summarize`，由 Node 转发 DeepSeek