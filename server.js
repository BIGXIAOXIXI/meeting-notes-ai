require("dotenv").config();
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

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
    "你是会议/课堂纪要助手。只根据用户原文整理，不编造。\n" +
    "严格按下面格式输出中文：\n" +
    "## 纪要\n- 条目要点（3～8条）\n" +
    "## 行动项\n- [ ] 待办；尽量含负责人或截止日期（原文没有就写「待定」）\n" +
    "若信息不足，在文末加一行：## 待确认";

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

app.listen(PORT, "0.0.0.0", () => {
  console.log("打开浏览器访问 http://localhost:" + PORT);
});