const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");

const brief = fs.readFileSync(path.join(__dirname, "BRIEF.md"), "utf8");
const model = "gpt-5.6-luna";
const voiceStyles = {
  friendly: "Use a warm, steady, kind tone. Acknowledge what the user shared, then offer gentle support. Do not sound overly excited.",
  casual: "Use relaxed everyday language and contractions, like a supportive friend. You may use one light conversational phrase, but never joke about pain or sound dismissive.",
  empathetic: "Lead with a gentle reflection of the user's feeling and validate it before offering any idea. Use calm, patient language. Do not rush to positivity or advice.",
  upbeat: "Use bright, hopeful energy and one encouraging next step. Acknowledge hard feelings first; never use forced cheer or minimize sadness.",
};

function isHighRiskMessage(message) {
  return /\b(kill myself|hurt myself|suicide|self[- ]harm|someone is hurting me|being abused|threatening me|going to hurt someone|hurt them|hurt him|hurt her)\b/i.test(message);
}

async function getBubblReply(message, style = "friendly") {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing");
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const chosenStyle = voiceStyles[style] || voiceStyles.friendly;
  const response = await client.responses.create({
    model,
    instructions: `${brief}\n\nSpeaking style chosen by the user: ${chosenStyle} Keep the response to one or two supportive sentences.`,
    input: [{ role: "user", content: message }],
    max_output_tokens: 180,
  });

  return response.output_text.trim();
}

module.exports = { getBubblReply, isHighRiskMessage };
