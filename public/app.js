const notesInput = document.querySelector("#notesInput");
const generateButton = document.querySelector("#generateButton");
const sampleButton = document.querySelector("#sampleButton");
const notesCount = document.querySelector("#notesCount");
const privacyHint = document.querySelector("#privacyHint");
const errorBox = document.querySelector("#errorBox");
const builderCard = document.querySelector("#builderCard");
const gameCard = document.querySelector("#gameCard");
const resultsCard = document.querySelector("#resultsCard");
const gameStage = document.querySelector("#gameStage");
const selectedGameLabel = document.querySelector("#selectedGameLabel");
const totalPoints = document.querySelector("#totalPoints");
const gamesPlayed = document.querySelector("#gamesPlayed");
const bestStreak = document.querySelector("#bestStreak");
const gameLabels = { quiz: "Quick quiz", matching: "Matching", speed: "Speed round" };
const sampleNotes = "The solar system is made of the Sun and everything that orbits it. The Sun is a star at the center of our solar system.\n\nThe inner planets are Mercury, Venus, Earth, and Mars. They are rocky planets. The outer planets are Jupiter, Saturn, Uranus, and Neptune. They are much larger and mostly made of gases or ice.\n\nEarth has one natural satellite: the Moon. A planet's orbit is the curved path it follows around a star. Gravity keeps planets in orbit.";

let selectedMode = "quiz";
let currentGame = null;
let currentIndex = 0;
let points = 0;
let streak = 0;
let bestRoundStreak = 0;
let speedTimer = null;
let matchSelection = { term: null, definition: null };

function renderStats() {
  const state = QuiblyStorage.read();
  totalPoints.textContent = state.totalPoints;
  gamesPlayed.textContent = state.gamesPlayed;
  bestStreak.innerHTML = state.bestStreak + " <small>in a row</small>";
}

function setNotesCount() {
  notesCount.textContent = notesInput.value.length.toLocaleString() + " / 12,000";
  privacyHint.textContent = hasPrivateDetail(notesInput.value) ? "Please remove names, emails, or phone numbers." : "No names or private details needed.";
  privacyHint.classList.toggle("warning", hasPrivateDetail(notesInput.value));
}

function hasPrivateDetail(text) { return /(?:\b\d{3}[-.\s]\d{3}[-.\s]\d{4}\b|\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b)/i.test(text); }
function selectMode(mode) {
  selectedMode = mode;
  document.querySelectorAll(".mode-card").forEach((card) => {
    const selected = card.dataset.mode === mode;
    card.classList.toggle("selected", selected);
    card.setAttribute("aria-checked", String(selected));
  });
  selectedGameLabel.textContent = gameLabels[mode];
}
function showError(message) { errorBox.textContent = message; errorBox.hidden = false; }
function hideError() { errorBox.hidden = true; errorBox.textContent = ""; }
function setGenerating(isGenerating) {
  generateButton.disabled = isGenerating;
  generateButton.querySelector("span:first-child").textContent = isGenerating ? "Thinking…" : "Make my game";
}
function resetGameView() {
  window.clearInterval(speedTimer);
  currentGame = null; currentIndex = 0; points = 0; streak = 0; bestRoundStreak = 0; matchSelection = { term: null, definition: null };
  gameCard.hidden = true; resultsCard.hidden = true; builderCard.hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function startGame(game) {
  currentGame = { title: game.title, mode: selectedMode, questions: Array.isArray(game.questions) ? game.questions.slice(0, 8) : [] };
  if (!currentGame.questions.length) throw new Error("Quibly received no questions. Please try again with a few more notes.");
  currentIndex = 0; points = 0; streak = 0; bestRoundStreak = 0; matchSelection = { term: null, definition: null };
  builderCard.hidden = true; resultsCard.hidden = true; gameCard.hidden = false;
  document.querySelector("#gameTitle").textContent = gameLabels[selectedMode] + " ready";
  document.querySelector("#gameSubtitle").textContent = "Made from your notes · " + currentGame.questions.length + " questions";
  renderQuestion();
  gameCard.scrollIntoView({ behavior: "smooth", block: "start" });
}
function renderQuestion() {
  window.clearInterval(speedTimer);
  const question = currentGame.questions[currentIndex];
  const total = currentGame.questions.length;
  document.querySelector("#gamePoints").textContent = points;
  document.querySelector("#progressText").textContent = (currentIndex + 1) + " / " + total;
  document.querySelector("#progressBar").style.width = ((currentIndex / total) * 100) + "%";
  document.querySelector("#streakPill").textContent = "🔥 streak " + streak;
  if (selectedMode === "matching") renderMatchingQuestion(question); else renderChoiceQuestion(question);
}
function renderChoiceQuestion(question) {
  const choices = Array.isArray(question.choices) && question.choices.length ? question.choices : [question.answer];
  const choicesHtml = choices.map((choice, index) => '<button class="answer-button" type="button" data-answer-index="' + index + '"><span>' + String.fromCharCode(65 + index) + "</span>" + escapeHtml(choice) + "</button>").join("");
  const timerHtml = selectedMode === "speed" ? '<span class="timer-pill" id="timerPill">15s</span>' : "";
  gameStage.innerHTML = '<div class="question-panel"><div class="question-meta"><span class="question-number">QUESTION ' + String(currentIndex + 1).padStart(2, "0") + "</span>" + timerHtml + '</div><h3>' + escapeHtml(question.prompt) + '</h3><div class="answer-grid">' + choicesHtml + '</div><p class="source-note">✦ Built from your notes · answer carefully</p></div>';
  gameStage.querySelectorAll(".answer-button").forEach((button) => button.addEventListener("click", () => answerChoice(Number(button.dataset.answerIndex), question, button)));
  if (selectedMode === "speed") startTimer(question);
}
function startTimer(question) {
  let remaining = 15;
  const timerPill = document.querySelector("#timerPill");
  speedTimer = window.setInterval(() => {
    remaining -= 1;
    if (timerPill) timerPill.textContent = remaining + "s";
    if (remaining <= 0) { window.clearInterval(speedTimer); answerChoice(-1, question, null, true); }
  }, 1000);
}
function answerChoice(choiceIndex, question, clickedButton, timedOut) {
  if (gameStage.querySelector(".answered")) return;
  window.clearInterval(speedTimer);
  const buttons = Array.from(gameStage.querySelectorAll(".answer-button"));
  const correctText = String(question.answer || "").trim();
  const chosenText = choiceIndex >= 0 ? String(question.choices && question.choices[choiceIndex] || "").trim() : "";
  const correct = Boolean(chosenText) && chosenText.toLowerCase() === correctText.toLowerCase();
  const remainingSeconds = Number((document.querySelector("#timerPill")?.textContent || "").replace("s", "")) || 0;
  const earned = correct ? (selectedMode === "speed" ? 20 + remainingSeconds : 20) : 0;
  buttons.forEach((button, index) => { button.disabled = true; if (String(question.choices && question.choices[index] || "").trim().toLowerCase() === correctText.toLowerCase()) button.classList.add("correct"); });
  if (clickedButton && !correct) clickedButton.classList.add("wrong");
  gameStage.querySelector(".question-panel").classList.add("answered");
  if (correct) { points += earned; streak += 1; bestRoundStreak = Math.max(bestRoundStreak, streak); } else streak = 0;
  document.querySelector("#gamePoints").textContent = points;
  document.querySelector("#streakPill").textContent = "🔥 streak " + streak;
  const feedback = document.createElement("div"); feedback.className = "answer-feedback " + (correct ? "is-correct" : "is-wrong");
  feedback.innerHTML = "<strong>" + (correct ? "Nice! +" + earned + " points" : timedOut ? "Time!" : "Not quite") + "</strong><span>" + escapeHtml(correct ? (question.explanation || "You got it from your notes.") : "The answer is: " + question.answer) + '</span><button class="next-button" type="button">' + (currentIndex === currentGame.questions.length - 1 ? "See my score" : "Next question") + " →</button>";
  gameStage.querySelector(".question-panel").appendChild(feedback);
  feedback.querySelector(".next-button").addEventListener("click", nextQuestion);
}
function renderMatchingQuestion(question) {
  const definitions = (question.choices || []).slice(0, 3);
  const pairs = [{ term: question.prompt, definition: question.answer }].concat(definitions.filter((item) => item.toLowerCase() !== String(question.answer).toLowerCase()).slice(0, 2).map((item, index) => ({ term: "Key idea " + (index + 2), definition: item })));
  const shuffledDefinitions = pairs.map((pair) => pair.definition).sort(() => Math.random() - 0.5);
  const termsHtml = pairs.map((pair, index) => '<button class="match-button term-button" type="button" data-term="' + index + '">' + escapeHtml(pair.term) + "</button>").join("");
  const definitionsHtml = shuffledDefinitions.map((definition) => '<button class="match-button definition-button" type="button" data-definition="' + pairs.findIndex((pair) => pair.definition === definition) + '">' + escapeHtml(definition) + "</button>").join("");
  gameStage.innerHTML = '<div class="question-panel matching-panel"><div class="question-meta"><span class="question-number">MATCH THE PAIRS</span><span class="match-help">Select a term, then its meaning</span></div><h3>Which meaning belongs with this term?</h3><div class="match-layout"><div class="match-column"><p>TERMS</p>' + termsHtml + '</div><div class="match-column"><p>MEANINGS</p>' + definitionsHtml + '</div></div><p class="source-note">✦ Every pair comes from your notes.</p></div>';
  gameStage.querySelectorAll(".term-button").forEach((button) => button.addEventListener("click", () => { gameStage.querySelectorAll(".term-button").forEach((item) => item.classList.remove("active")); button.classList.add("active"); matchSelection.term = Number(button.dataset.term); tryMatch(question); }));
  gameStage.querySelectorAll(".definition-button").forEach((button) => button.addEventListener("click", () => { gameStage.querySelectorAll(".definition-button").forEach((item) => item.classList.remove("active")); button.classList.add("active"); matchSelection.definition = Number(button.dataset.definition); tryMatch(question); }));
}
function tryMatch(question) {
  if (matchSelection.term === null || matchSelection.definition === null) return;
  const correct = matchSelection.term === matchSelection.definition;
  const panel = gameStage.querySelector(".question-panel");
  panel.querySelectorAll(".match-button").forEach((button) => button.disabled = true);
  panel.classList.add("answered");
  if (correct) { points += 25; streak += 1; bestRoundStreak = Math.max(bestRoundStreak, streak); } else streak = 0;
  document.querySelector("#gamePoints").textContent = points; document.querySelector("#streakPill").textContent = "🔥 streak " + streak;
  const feedback = document.createElement("div"); feedback.className = "answer-feedback " + (correct ? "is-correct" : "is-wrong");
  feedback.innerHTML = "<strong>" + (correct ? "+25 points · Perfect pair!" : "Almost!") + "</strong><span>" + escapeHtml(correct ? (question.explanation || "That pair matches your notes.") : "The right meaning is: " + question.answer) + '</span><button class="next-button" type="button">' + (currentIndex === currentGame.questions.length - 1 ? "See my score" : "Next pair") + " →</button>";
  panel.appendChild(feedback); feedback.querySelector(".next-button").addEventListener("click", nextQuestion);
}
function nextQuestion() { currentIndex += 1; matchSelection = { term: null, definition: null }; if (currentIndex >= currentGame.questions.length) showResults(); else renderQuestion(); }
function showResults() {
  window.clearInterval(speedTimer);
  QuiblyStorage.recordGame({ mode: selectedMode, points, bestStreak: bestRoundStreak, questionCount: currentGame.questions.length });
  renderStats(); gameCard.hidden = true; resultsCard.hidden = false;
  document.querySelector("#resultsTitle").textContent = points > currentGame.questions.length * 14 ? "You are on a roll!" : "Nice work — you showed up.";
  document.querySelector("#resultsSummary").textContent = "You finished " + currentGame.questions.length + " " + (selectedMode === "matching" ? "pairs" : "questions") + " and earned " + points + " points. Keep the streak going when you are ready.";
  document.querySelector("#resultsScore").textContent = points; document.querySelector("#resultsStreak").textContent = bestRoundStreak; document.querySelector("#resultsReward").textContent = "+" + points + " XP";
  resultsCard.scrollIntoView({ behavior: "smooth", block: "center" });
}
async function generateGame() {
  const notes = notesInput.value.trim(); hideError();
  if (notes.length < 40) { showError("Add a few more notes first — Quibly needs enough facts to make a good game."); notesInput.focus(); return; }
  if (hasPrivateDetail(notes)) { showError("Please remove private details like emails or phone numbers. Quibly does not need them to make your game."); return; }
  setGenerating(true);
  try {
    const response = await fetch("/api/generate-quiz", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ notes, gameType: selectedMode }) });
    const data = await response.json(); if (!response.ok) throw new Error(data.error || "Quibly could not make that game yet.");
    startGame(data);
  } catch (error) { showError(error.message || "I couldn't reach Quibly. Please check the OpenAI key in .env and your internet connection."); }
  finally { setGenerating(false); }
}
function escapeHtml(value) { return String(value ?? "").replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character])); }

notesInput.addEventListener("input", setNotesCount);
sampleButton.addEventListener("click", () => { notesInput.value = sampleNotes; setNotesCount(); notesInput.focus(); });
document.querySelectorAll(".mode-card").forEach((card) => card.addEventListener("click", () => selectMode(card.dataset.mode)));
generateButton.addEventListener("click", generateGame);
document.querySelector("#newGameButton").addEventListener("click", resetGameView);
document.querySelector("#backToBuilderButton").addEventListener("click", resetGameView);
document.querySelector("#playAgainButton").addEventListener("click", () => { if (currentGame) { currentIndex = 0; points = 0; streak = 0; bestRoundStreak = 0; resultsCard.hidden = true; gameCard.hidden = false; renderQuestion(); gameCard.scrollIntoView({ behavior: "smooth", block: "start" }); } });
renderStats(); setNotesCount();
