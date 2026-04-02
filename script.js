const points = [1000, 100, 10, 1];
let currentIndex = -1;
let attempt = 0;
let score = 0;
let completed = 0;
let wrongGuesses = new Set();

const currentScore = document.getElementById("current-score");
const completedCount = document.getElementById("completed-count");
const levelText = document.getElementById("level");
const questionTitle = document.getElementById("question-title");
const answersEl = document.getElementById("answers");
const feedback = document.getElementById("feedback");
const hint = document.getElementById("hint");
const attemptInfo = document.getElementById("attemptInfo");
const nextButton = document.getElementById("nextButton");
const startButton = document.getElementById("startButton");
const resetButton = document.getElementById("resetButton");

function getCookie(name) {
  const pairs = document.cookie.split(";").map((p) => p.trim());
  for (const p of pairs) {
    if (!p) continue;
    const [k,v] = p.split("=");
    if (k === name) return decodeURIComponent(v);
  }
  return null;
}

function setCookie(name, value, days = 365) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

function persistProgress() {
  localStorage.setItem("englishQuestScore", score.toString());
  localStorage.setItem("englishQuestCompleted", completed.toString());
  setCookie("englishQuestScore", score, 365);
  setCookie("englishQuestCompleted", completed, 365);
}

function loadProgress() {
  const savedScore = parseInt(localStorage.getItem("englishQuestScore") || getCookie("englishQuestScore") || "0", 10);
  const savedCompleted = parseInt(localStorage.getItem("englishQuestCompleted") || getCookie("englishQuestCompleted") || "0", 10);
  score = Number.isNaN(savedScore) ? 0 : savedScore;
  completed = Number.isNaN(savedCompleted) ? 0 : savedCompleted;
  updateScore();
}

function updateScore() {
  currentScore.textContent = score.toString();
  completedCount.textContent = completed.toString();
  levelText.textContent = Math.min(20, Math.floor(score / 5000) + 1).toString();
}

function showQuestion(index) {
  currentIndex = index;
  attempt = 0;
  wrongGuesses.clear();
  const q = questionBank[index];
  questionTitle.textContent = `${q.id}. ${q.question}`;
  hint.textContent = q.hint;
  feedback.textContent = "";
  attemptInfo.textContent = "Attempt: 0 of 4";

  answersEl.innerHTML = "";
  q.options.forEach((option, i) => {
    const btn = document.createElement("button");
    btn.className = "btn";
    btn.textContent = option;
    btn.onclick = () => selectAnswer(i);
    answersEl.appendChild(btn);
  });

  nextButton.disabled = true;
}

function selectAnswer(index) {
  const q = questionBank[currentIndex];
  attempt += 1;
  attemptInfo.textContent = `Attempt: ${attempt} of 4`;

  if (q.answer === index) {
    const add = points[Math.min(attempt - 1, points.length - 1)];
    score += add;
    completed += 1;
    const msg = `Correct! +${add} points.`;
    feedback.textContent = msg;
    feedback.className = "feedback correct";

    disableAnswers();
    nextButton.disabled = false;
    persistProgress();
    updateScore();

    if (completed >= questionBank.length) {
      questionTitle.textContent = "Bravo! All 100 quests done!";
      hint.textContent = "You have finished the learning game. Reset to play again or refresh.";
      nextButton.disabled = true;
      return;
    }
  } else {
    wrongGuesses.add(index);
    feedback.textContent = "Oops, not quite. Try again!";
    feedback.className = "feedback wrong";
    if (attempt >= 4) {
      feedback.textContent = `No more tries. Correct answer: ${q.options[q.answer]}`;
      disableAnswers();
      nextButton.disabled = false;
    }
  }
}

function disableAnswers() {
  const buttons = answersEl.querySelectorAll("button");
  buttons.forEach((btn) => (btn.disabled = true));
}

function nextQuestion() {
  if (completed >= questionBank.length) return;
  const remaining = questionBank
    .map((q, i) => ({ q, i }))
    .filter((entry) => entry.q && entry.q.id <= questionBank.length) // preserve
  ;
  let next = currentIndex + 1;
  if (next >= questionBank.length) next = 0;
  showQuestion(next);
}

function startQuest() {
  if (questionBank.length === 0) return;
  showQuestion(0);
}

function resetProgress() {
  score = 0;
  completed = 0;
  localStorage.removeItem("englishQuestScore");
  localStorage.removeItem("englishQuestCompleted");
  setCookie("englishQuestScore", "", -1);
  setCookie("englishQuestCompleted", "", -1);
  updateScore();
  feedback.textContent = "Progress reset. Press Start to begin again.";
  feedback.className = "feedback";
  questionTitle.textContent = "Press Start to begin your adventure";
  hint.textContent = "";
  answersEl.innerHTML = "";
  attemptInfo.textContent = "";
  nextButton.disabled = true;
}

startButton.addEventListener("click", () => {
  startQuest();
});

nextButton.addEventListener("click", () => {
  nextQuestion();
});

resetButton.addEventListener("click", () => {
  if (confirm("Are you sure you want to reset your progress?")) {
    resetProgress();
  }
});

loadProgress();
