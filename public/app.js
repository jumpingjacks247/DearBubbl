const chatForm = document.querySelector("#chatForm");
const messageInput = document.querySelector("#messageInput");
const sendButton = document.querySelector("#sendButton");
const chatLog = document.querySelector("#chatLog");
const starterArea = document.querySelector("#starterArea");
const nextStepCard = document.querySelector("#nextStepCard");
const stepText = document.querySelector("#stepText");
const completeStepButton = document.querySelector("#completeStepButton");
const helpCard = document.querySelector("#helpCard");
const privacyHint = document.querySelector("#privacyHint");

let lastStepId = null;

function addMessage(kind, text) {
  const row = document.createElement("div");
  row.className = `message-row ${kind === "user" ? "user-row" : "bubbl-row"}`;
  row.innerHTML = kind === "user"
    ? `<div class="message-bubble user-bubble"><p></p><span class="message-time">just now</span></div>`
    : `<div class="message-avatar">b</div><div class="message-bubble bubbl-bubble"><p></p><span class="message-time">just now</span></div>`;
  row.querySelector("p").textContent = text;
  chatLog.appendChild(row);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function showThinking() {
  const row = document.createElement("div");
  row.className = "message-row bubbl-row thinking-row";
  row.id = "thinkingRow";
  row.innerHTML = `<div class="message-avatar">b</div><div class="message-bubble bubbl-bubble thinking"><span></span><span></span><span></span><em>Thinking…</em></div>`;
  chatLog.appendChild(row);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function removeThinking() {
  document.querySelector("#thinkingRow")?.remove();
}

function containsPrivateDetail(text) {
  return /(?:\b\d{3}[-.\s]\d{3}[-.\s]\d{4}\b|\b\d{1,5}\s+[A-Za-z]+\s+(?:Street|St|Road|Rd|Avenue|Ave|Drive|Dr|Lane|Ln)\b|\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b)/i.test(text);
}

function showNextStep() {
  const state = DearBubblStorage.readState();
  const available = state.sampleSteps.find((step) => !state.completedSteps.includes(step.id)) || state.sampleSteps[0];
  lastStepId = available.id;
  stepText.textContent = available.label;
  nextStepCard.hidden = false;
}

document.querySelectorAll(".starter-card").forEach((button) => {
  button.addEventListener("click", () => {
    messageInput.value = `${button.dataset.starter} `;
    messageInput.focus();
    starterArea.classList.add("chosen");
    privacyHint.textContent = "Add only what feels okay to share ♡";
  });
});

messageInput.addEventListener("input", () => {
  privacyHint.textContent = containsPrivateDetail(messageInput.value)
    ? "Please remove private details before sending ♡"
    : "No private details, please ♡";
  privacyHint.classList.toggle("warning", containsPrivateDetail(messageInput.value));
});

chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const message = messageInput.value.trim();
  if (!message || sendButton.disabled) return;
  if (containsPrivateDetail(message)) {
    privacyHint.textContent = "Let's remove that private detail first ♡";
    privacyHint.classList.add("warning");
    return;
  }

  addMessage("user", message);
  DearBubblStorage.addConversation({ role: "user", text: message, createdAt: new Date().toISOString() });
  messageInput.value = "";
  sendButton.disabled = true;
  sendButton.querySelector("span:first-child").textContent = "Thinking…";
  showThinking();

  try {
    const result = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
    const data = await result.json();
    removeThinking();
    if (!result.ok) throw new Error(data.error || "Bubbl needs a moment.");
    addMessage("bubbl", data.reply);
    DearBubblStorage.addConversation({ role: "bubbl", text: data.reply, createdAt: new Date().toISOString() });
    if (data.safety) helpCard.hidden = false;
    showNextStep();
  } catch (error) {
    removeThinking();
    addMessage("bubbl", error.message || "I couldn't reach Bubbl right now. Please check the OpenAI key in .env and your internet connection, then try again.");
  } finally {
    sendButton.disabled = false;
    sendButton.querySelector("span:first-child").textContent = "Send to Bubbl";
    messageInput.focus();
  }
});

completeStepButton.addEventListener("click", () => {
  if (!lastStepId) return;
  DearBubblStorage.completeStep(lastStepId);
  completeStepButton.textContent = "Saved as a win ✓";
  completeStepButton.disabled = true;
  stepText.textContent = "That counts. Small steps are still brave steps. You can leave whenever you want.";
});
