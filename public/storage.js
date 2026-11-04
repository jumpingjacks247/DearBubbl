const STORAGE_KEY = "dearbubbl-v1";

const dailyGoalTasks = [
  { id: "smile", label: "Smile at a person you have never talked to before." },
  { id: "lonely", label: "Say hi and hang out with a person who seems lonely." },
  { id: "trusted-adult", label: "Talk about your feelings with a trusted adult." },
];

const sampleState = {
  version: 1,
  conversations: [],
  completedSteps: [],
  dailyGoals: { date: "", completed: [] },
  sampleSteps: [
    { id: "wave", label: "Wave hi to someone you do not usually talk to." },
    { id: "sit", label: "Sit near someone and ask one easy question." },
    { id: "opinion", label: "Share one small opinion kindly." },
  ],
};

function readState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    const state = saved ? { ...sampleState, ...saved } : structuredClone(sampleState);
    if (!state.dailyGoals || state.dailyGoals.date !== todayKey()) {
      state.dailyGoals = { date: todayKey(), completed: [] };
      saveState(state);
    }
    return state;
  } catch {
    return structuredClone(sampleState);
  }
}

function todayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
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

function getDailyGoals() {
  const state = readState();
  return dailyGoalTasks.map((task) => ({
    ...task,
    completed: state.dailyGoals.completed.includes(task.id),
  }));
}

function toggleDailyGoal(goalId, completed) {
  const state = readState();
  const completedGoals = new Set(state.dailyGoals.completed);
  if (completed) completedGoals.add(goalId);
  else completedGoals.delete(goalId);
  state.dailyGoals.completed = [...completedGoals];
  saveState(state);
}

window.DearBubblStorage = { readState, addConversation, completeStep, getDailyGoals, toggleDailyGoal };
