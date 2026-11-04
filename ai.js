const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");

const brief = fs.readFileSync(path.join(__dirname, "BRIEF.md"), "utf8");
const model = "gpt-5.6-luna";

function isHighRiskMessage(message) {
  return /\b(kill myself|hurt myself|suicide|self[- ]harm|someone is hurting me|being abused|threatening me|going to hurt someone|hurt them|hurt him|hurt her)\b/i.test(message);
}

async function getBubblReply(message) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing");
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await client.responses.create({
    model,
    instructions: brief,
    input: [{ role: "user", content: message }],
    max_output_tokens: 180,
  });

  return response.output_text.trim();
}

module.exports = { getBubblReply, isHighRiskMessage };
