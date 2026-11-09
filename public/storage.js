const STORAGE_KEY = "dearbubbl-v1";

const dailyGoalTasks = [
  { id: "smile", label: "Smile at a person you have never talked to before." },
  { id: "lonely", label: "Say hi and hang out with a person who seems lonely." },
  { id: "trusted-adult", label: "Talk about your feelings with a trusted adult." },
];

const quotes = [
  "The only way to do great work is to love what you do. — Steve Jobs",
  "Believe you can and you're halfway there. — Theodore Roosevelt",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. — Winston Churchill",
  "Dream big and dare to fail. — Norman Vaughan",
  "Don't watch the clock; do what it does. Keep going. — Sam Levenson",
  "The secret of getting ahead is getting started. — Mark Twain",
  "Great things never come from comfort zones.",
  "Your future is created by what you do today, not tomorrow.",
  "The harder you work for something, the greater you'll feel when you achieve it.",
  "Don't stop until you're proud.",
  "Fall seven times, stand up eight. — Japanese Proverb",
  "What lies behind us and what lies before us are tiny matters compared to what lies within us. — Ralph Waldo Emerson",
  "Strength grows in the moments when you think you can't go on but keep going anyway.",
  "Difficult roads often lead to beautiful destinations.",
  "You are stronger than you think.",
  "Rock bottom became the solid foundation on which I rebuilt my life. — J.K. Rowling",
  "A smooth sea never made a skilled sailor.",
  "The comeback is always stronger than the setback.",
  "Challenges are what make life interesting. Overcoming them is what makes life meaningful.",
  "One day or day one. You decide.",
  "You alone are enough. You have nothing to prove to anybody. — Maya Angelou",
  "Be yourself; everyone else is already taken. — Oscar Wilde",
  "No one can make you feel inferior without your consent. — Eleanor Roosevelt",
  "You are worthy of the dreams you carry.",
  "Confidence comes from keeping the promises you make to yourself.",
  "You don't have to be perfect to be amazing.",
  "Know your worth, then add tax.",
  "Be proud of how far you've come, and have faith in how far you can go.",
  "Your only competition is the person you were yesterday.",
  "Never apologize for being yourself.",
  "Life is what happens when you're busy making other plans. — John Lennon",
  "Happiness is not something ready-made. It comes from your own actions. — Dalai Lama",
  "Enjoy the little things, for one day you may look back and realize they were the big things.",
  "Every day may not be good, but there is something good in every day.",
  "Life is short. Make every moment count.",
  "Wherever you go, go with all your heart. — Confucius",
  "The purpose of our lives is to be happy. — Dalai Lama",
  "Don't count the days, make the days count. — Muhammad Ali",
  "Life becomes easier when you learn to accept the apology you never got.",
  "Collect moments, not things.",
  "The future belongs to those who believe in the beauty of their dreams. — Eleanor Roosevelt",
  "If you can dream it, you can do it. — Walt Disney",
  "Go confidently in the direction of your dreams. Live the life you have imagined. — Henry David Thoreau",
  "Your dreams don't work unless you do.",
  "Great things take time. Be patient with yourself.",
  "Don't let small minds convince you that your dreams are too big.",
  "Everything you've ever wanted is on the other side of fear. — George Addair",
  "Make your vision so clear that your fears become irrelevant.",
  "Be fearless in the pursuit of what sets your soul on fire.",
  "The best way to predict the future is to create it. — Peter Drucker",
  "Keep your face always toward the sunshine—and shadows will fall behind you. — Walt Whitman",
  "A positive mind finds opportunity in everything.",
  "Gratitude turns what we have into enough.",
  "Choose to shine, even on cloudy days.",
  "The more grateful you are, the more beauty you see.",
  "Let your smile change the world, but don't let the world change your smile.",
  "Every sunrise is an invitation to begin again.",
  "Positive thoughts create positive actions.",
  "Be the reason someone believes in the goodness of people.",
  "A little progress each day adds up to big results.",
  "Courage is not the absence of fear, but the triumph over it. — Nelson Mandela",
  "Do one thing every day that scares you. — Eleanor Roosevelt",
  "Everything you want is waiting on the other side of courage.",
  "If it scares you, it might be a good thing to try.",
  "Don't be afraid to give up the good to go for the great. — John D. Rockefeller",
  "You miss 100% of the shots you don't take. — Wayne Gretzky",
  "Take the risk or lose the chance.",
  "A ship in harbor is safe, but that is not what ships are built for. — John A. Shedd",
  "Be brave enough to start a new chapter.",
  "Fear is temporary. Regret lasts longer.",
  "The only impossible journey is the one you never begin. — Tony Robbins",
  "Turn your wounds into wisdom. — Oprah Winfrey",
  "Growth begins at the end of your comfort zone.",
  "Never stop learning, because life never stops teaching.",
  "Mistakes are proof that you are trying.",
  "Be a work in progress, not a finished product.",
  "Don't compare your chapter one to someone else's chapter twenty.",
  "Small steps every day lead to big changes.",
  "The beautiful thing about learning is that nobody can take it away from you. — B.B. King",
  "Every experience is an opportunity to grow.",
  "Even the darkest night will end and the sun will rise. — Victor Hugo",
  "Every moment is a fresh beginning. — T.S. Eliot",
  "You are never too old to set another goal or dream a new dream. — C.S. Lewis",
  "Sometimes the smallest step in the right direction ends up being the biggest step of your life.",
  "After every storm comes a rainbow.",
  "Let go of what was, embrace what is, and have faith in what will be.",
  "New beginnings are often disguised as painful endings. — Lao Tzu",
  "Your story isn't over yet.",
  "There is always a reason to hope.",
  "Tomorrow is another chance to get it right.",
  "Act as if what you do makes a difference. It does. — William James",
  "Be so good they can't ignore you. — Steve Martin",
  "Great minds discuss ideas; average minds discuss events; small minds discuss people. — Eleanor Roosevelt",
  "What we think, we become. — Buddha",
  "Don't let yesterday take up too much of today. — Will Rogers",
  "The best revenge is massive success. — Frank Sinatra",
  "Nothing will work unless you do. — Maya Angelou",
  "You get in life what you have the courage to ask for. — Oprah Winfrey",
  "Make each day your masterpiece. — John Wooden",
  "One life. One chance. Make it extraordinary.",
];

const rarityTiers = [
  { key: "common", label: "Common" },
  { key: "rare", label: "Rare" },
  { key: "super-rare", label: "Super Rare" },
  { key: "legendary", label: "Legendary" },
];

const sampleState = {
  version: 1,
  conversations: [],
  completedSteps: [],
  dailyGoals: { date: "", completed: [] },
  collectedQuotes: [],
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

function quoteWithRarity(index) {
  const rarity = rarityTiers[Math.floor(index / 25)] || rarityTiers[0];
  return { id: index, text: quotes[index], rarity: rarity.key, rarityLabel: rarity.label };
}

function drawBlindBoxQuote() {
  const state = readState();
  const collected = Array.isArray(state.collectedQuotes) ? state.collectedQuotes : [];
  const collectedSet = new Set(collected);
  const available = quotes.map((_quote, index) => index).filter((index) => !collectedSet.has(index));
  if (!available.length) return null;
  const index = available[Math.floor(Math.random() * available.length)];
  state.collectedQuotes = [...collected, index];
  saveState(state);
  return quoteWithRarity(index);
}

function getQuoteCollection() {
  const state = readState();
  const collected = Array.isArray(state.collectedQuotes) ? state.collectedQuotes : [];
  return collected.map(quoteWithRarity);
}

window.DearBubblStorage = { readState, addConversation, completeStep, getDailyGoals, toggleDailyGoal, drawBlindBoxQuote, getQuoteCollection };
