const QUIBLY_STORAGE_KEY = "quibly-v1";

const emptyState = { version: 1, totalPoints: 0, gamesPlayed: 0, bestStreak: 0, sessions: [] };

function readQuiblyState() {
  try { return { ...emptyState, ...(JSON.parse(localStorage.getItem(QUIBLY_STORAGE_KEY)) || {}) }; }
  catch { return { ...emptyState, sessions: [] }; }
}

function saveQuiblyState(state) { localStorage.setItem(QUIBLY_STORAGE_KEY, JSON.stringify(state)); }

function recordGame(game) {
  const state = readQuiblyState();
  state.totalPoints += Number(game.points) || 0;
  state.gamesPlayed += 1;
  state.bestStreak = Math.max(state.bestStreak, Number(game.bestStreak) || 0);
  state.sessions = [...(state.sessions || []).slice(-9), { ...game, savedAt: new Date().toISOString() }];
  saveQuiblyState(state);
  return state;
}

window.QuiblyStorage = { read: readQuiblyState, recordGame };
