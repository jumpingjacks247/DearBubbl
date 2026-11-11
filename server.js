require("dotenv").config();

const express = require("express");
const path = require("path");
const { getBubblReply, isHighRiskMessage } = require("./ai.js");

const app = express();
const port = Number(process.env.PORT || 3000);
const allowedVoiceStyles = new Set(["friendly", "casual", "empathetic", "upbeat"]);

app.use(express.json({ limit: "32kb" }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (_request, response) => {
  response.json({ ok: true, aiReady: Boolean(process.env.OPENAI_API_KEY) });
});

app.post("/api/chat", async (request, response) => {
  const message = typeof request.body?.message === "string" ? request.body.message.trim() : "";
  const style = allowedVoiceStyles.has(request.body?.style) ? request.body.style : "friendly";

  if (!message) {
    response.status(400).json({ error: "Please write a message first." });
    return;
  }

  if (message.length > 1200) {
    response.status(400).json({ error: "Let's keep this first chat short and comfortable." });
    return;
  }

  if (isHighRiskMessage(message)) {
    response.json({
      safety: true,
      reply: "I'm really glad you told me. You deserve support from a trusted adult right now. If you may be in immediate danger, call 911; in the U.S., call or text 988 for the Suicide & Crisis Lifeline.",
    });
    return;
  }

  try {
    const reply = await getBubblReply(message, style);
    response.json({ reply });
  } catch (error) {
    console.error("DearBubbl AI request failed:", error?.message || "unknown error");
    response.status(503).json({
      error: "I couldn't reach Bubbl right now. Please check the OpenAI key in .env and your internet connection, then try again.",
    });
  }
});

app.get("*", (_request, response) => {
  response.sendFile(path.join(__dirname, "public", "index.html"));
});

if (require.main === module) {
  app.listen(port, "127.0.0.1", () => {
    console.log(`DearBubbl is running at http://127.0.0.1:${port}`);
  });
}

module.exports = app;
