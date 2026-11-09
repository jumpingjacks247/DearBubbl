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
const dailyGoalList = document.querySelector("#dailyGoalList");
const goalCount = document.querySelector("#goalCount");
const quoteFlight = document.querySelector("#quoteFlight");
const quoteText = document.querySelector("#quoteText");
const quoteNoteLabel = document.querySelector("#quoteNoteLabel");
const quoteNoteClose = document.querySelector("#quoteNoteClose");
const quoteCollectionList = document.querySelector("#quoteCollectionList");
const collectionCount = document.querySelector("#collectionCount");
const topCollectionCount = document.querySelector("#topCollectionCount");

let lastStepId = null;
let quoteOpenTimer;
let quoteHideTimer;

function closeQuoteNote() {
  clearTimeout(quoteOpenTimer);
  clearTimeout(quoteHideTimer);
  quoteFlight.classList.remove("is-flying", "is-open", "rarity-common", "rarity-rare", "rarity-super-rare", "rarity-legendary");
  quoteFlight.hidden = true;
}

function showQuote(blindBox) {
  clearTimeout(quoteOpenTimer);
  clearTimeout(quoteHideTimer);
  quoteText.textContent = blindBox.text;
  quoteNoteLabel.textContent = `${blindBox.rarityLabel} sticky note`;
  quoteFlight.hidden = false;
  quoteFlight.classList.remove("is-flying", "is-open", "rarity-common", "rarity-rare", "rarity-super-rare", "rarity-legendary");
  quoteFlight.classList.add(`rarity-${blindBox.rarity}`);
  void quoteFlight.offsetWidth;
  quoteFlight.classList.add("is-flying");
  quoteOpenTimer = setTimeout(() => quoteFlight.classList.add("is-open"), 780);
  quoteHideTimer = setTimeout(closeQuoteNote, 7000);
}

function renderQuoteCollection() {
  const collection = DearBubblStorage.getQuoteCollection();
  collectionCount.textContent = `${collection.length} / 100 found`;
  topCollectionCount.textContent = `${collection.length} / 100`;
  const rarityGroups = [
    { key: "common", label: "Common", color: "yellow" },
    { key: "rare", label: "Rare", color: "purple" },
    { key: "super-rare", label: "Super Rare", color: "pink" },
    { key: "legendary", label: "Legendary", color: "blue" },
  ];
  quoteCollectionList.innerHTML = rarityGroups.map((group) => {
    const notes = collection.filter((quote) => quote.rarity === group.key);
    return `<section class="collection-group rarity-${group.key}">
      <div class="collection-group-heading"><span>${group.label}</span><small>${notes.length} / 25 · ${group.color}</small></div>
      <div class="collection-group-grid">${notes.length ? notes.map((quote) => `
        <article class="collection-note rarity-${quote.rarity}">
          <span class="collection-rarity">${quote.rarityLabel}</span>
          <p>${quote.text}</p>
        </article>
      `).join("") : '<p class="collection-empty">No notes yet</p>'}</div>
    </section>`;
  }).join("");
}

function renderDailyGoals() {
  const goals = DearBubblStorage.getDailyGoals();
  const completedCount = goals.filter((goal) => goal.completed).length;
  goalCount.textContent = `${completedCount} / ${goals.length} done`;
  dailyGoalList.innerHTML = goals.map((goal) => `
    <label class="daily-goal ${goal.completed ? "is-complete" : ""}">
      <input type="checkbox" data-goal-id="${goal.id}" ${goal.completed ? "checked" : ""} />
      <span class="goal-box" aria-hidden="true">✓</span>
      <span class="goal-label">${goal.label}</span>
      ${goal.completed ? '<span class="goal-thumb" aria-label="Goal complete">👍</span>' : ""}
    </label>
  `).join("");

  dailyGoalList.querySelectorAll("input[data-goal-id]").forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const completed = checkbox.checked;
      DearBubblStorage.toggleDailyGoal(checkbox.dataset.goalId, completed);
      renderDailyGoals();
      if (completed) {
        const blindBox = DearBubblStorage.drawBlindBoxQuote();
        if (blindBox) {
          showQuote(blindBox);
          renderQuoteCollection();
        }
      }
    });
  });
}

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

renderDailyGoals();
renderQuoteCollection();
quoteNoteClose.addEventListener("click", closeQuoteNote);

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
