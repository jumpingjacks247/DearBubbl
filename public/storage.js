const STORAGE_KEY = "dearbubbl-v1";

const sampleState = {
  version: 1,
  conversations: [],
  completedSteps: [],
  sampleSteps: [
    { id: "wave", label: "Wave hi to someone you do not usually talk to." },
    { id: "sit", label: "Sit near someone and ask one easy question." },
    { id: "opinion", label: "Share one small opinion kindly." },
  ],
};

function readState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved ? { ...sampleState, ...saved } : structuredClone(sampleState);
  } catch {
    return structuredClone(sampleState);
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function addConversation(conversation) {
  const state = readState();
  state.conversations.push(conversation);
  saveState(state);
}

function completeStep(stepId) {
  const state = readState();
  if (!state.completedSteps.includes(stepId)) state.completedSteps.push(stepId);
  saveState(state);
}

window.DearBubblStorage = { readState, addConversation, completeStep };
