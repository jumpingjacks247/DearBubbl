const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");

const brief = fs.readFileSync(path.join(__dirname, "BRIEF.md"), "utf8");
const model = "gpt-5.6-luna";
const outputShape = "Return only valid JSON with this exact shape: {\"title\":\"short game title\",\"questions\":[{\"prompt\":\"question or term\",\"answer\":\"correct answer\",\"choices\":[\"correct answer\",\"distractor\",\"distractor\",\"distractor\"],\"explanation\":\"one short explanation\"}]}. Make 5 questions. Every answer and choice must be supported by the user's notes. For matching mode, prompt should be a term and answer should be its matching meaning; choices should contain the answer plus two other meanings from the notes.";

async function makeStudyGame(notes, gameType) {
  if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is missing");
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const modeInstruction = gameType === "matching"
    ? "Make pairs of key terms and meanings for a matching game. Use distinct terms."
    : gameType === "speed"
      ? "Make short, quick-to-read questions for a 15-second speed round."
      : "Make clear multiple-choice questions for a friendly quick quiz.";
  const response = await client.responses.create({
    model,
    instructions: brief + "\n\nYou are Quibly's quiz-maker. " + modeInstruction + " " + outputShape + " Keep language simple for middle-school students. Do not use personal names or ask for personal information. Do not invent facts. If the notes are unclear, make fewer questions rather than guessing.",
    input: [{ role: "user", content: "Study notes:\n" + notes }],
    max_output_tokens: 1200,
  });
  const raw = response.output_text.trim().replace(/^\x60{3}json\s*/i, "").replace(/\x60{3}$/i, "").trim();
  const parsed = JSON.parse(raw);
  if (!parsed || !Array.isArray(parsed.questions)) throw new Error("AI returned an invalid game");
  return { title: typeof parsed.title === "string" ? parsed.title : "Your study game", questions: parsed.questions.map((question) => ({
    prompt: String(question.prompt || "").slice(0, 300),
    answer: String(question.answer || "").slice(0, 220),
    choices: Array.isArray(question.choices) ? question.choices.map((choice) => String(choice).slice(0, 220)).slice(0, 4) : [],
    explanation: String(question.explanation || "Based on your notes.").slice(0, 300),
  })) };
}

module.exports = { makeStudyGame };
