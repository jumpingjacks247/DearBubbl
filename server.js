require("dotenv").config();

const express = require("express");
const path = require("path");
const { makeStudyGame } = require("./ai.js");

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json({ limit: "24kb" }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (_request, response) => response.json({ ok: true, aiReady: Boolean(process.env.OPENAI_API_KEY) }));

app.post("/api/generate-quiz", async (request, response) => {
  const notes = typeof request.body?.notes === "string" ? request.body.notes.trim() : "";
  const gameType = ["quiz", "matching", "speed"].includes(request.body?.gameType) ? request.body.gameType : "quiz";
  if (notes.length < 40) return response.status(400).json({ error: "Please add a few more notes so Quibly can make accurate questions." });
  if (notes.length > 12000) return response.status(400).json({ error: "That is a lot of text. Please keep your notes under 12,000 characters." });
  try {
    const game = await makeStudyGame(notes, gameType);
    response.json(game);
  } catch (error) {
    console.error("Quibly AI request failed:", error?.message || "unknown error");
    response.status(503).json({ error: "Quibly couldn't make a game right now. Please check the OpenAI key in .env and your internet connection, then try again." });
  }
});

app.get("*", (_request, response) => response.sendFile(path.join(__dirname, "public", "index.html")));

if (require.main === module) app.listen(port, "127.0.0.1", () => console.log("Quibly is running at http://127.0.0.1:" + port));
module.exports = app;
