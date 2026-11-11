const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");

const brief = fs.readFileSync(path.join(__dirname, "BRIEF.md"), "utf8");
const model = "gpt-5.6-luna";
const voiceStyles = {
  friendly: "Sound warm, kind, and welcoming.",
  casual: "Sound easygoing and conversational, like a relaxed supportive chat.",
  empathetic: "Sound especially gentle, patient, and understanding of the user's feelings.",
  upbeat: "Sound bright, hopeful, and encouraging without dismissing the user's feelings.",
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
