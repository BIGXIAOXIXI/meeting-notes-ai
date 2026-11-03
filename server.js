require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "1mb" }));
app.use(express.static(__dirname));

app.post("/api/summarize", async (req, res) => {
  const text = (req.body && req.body.text) || "";
  if (!text.trim()) {
    return res.status(400).json({ error: "请先粘贴记录" });
  }
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) {
    return res.status(500).json({ error: "缺少 DEEPSEEK_API_KEY，请检查 .env" });
  }

  const prompt =
    "你是会议/课堂纪要助手。根据用户凌乱记录，输出两段中文：\n" +
    "1) 纪要（要点条目）\n2) 行动项（可执行清单，每条尽量含负责人或待办）。\n不要编造原文没有的事实。";

  try {
    const r = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + key,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: text },
        ],
        temperature: 0.3,
      }),
    });
    const data = await r.json();
    if (!r.ok) {
      return res.status(r.status).json({
        error: (data && data.error && data.error.message) || "DeepSeek 调用失败",
      });
    }
    const out =
      (data.choices &&
        data.choices[0] &&
        data.choices[0].message &&
        data.choices[0].message.content) ||
      "";
    res.json({ result: out });
  } catch (e) {
    res.status(500).json({ error: String(e.message || e) });
  }
});

app.listen(PORT, () => {
  console.log("打开浏览器访问 http://localhost:" + PORT);
});