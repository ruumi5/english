const points = [1000, 100, 10, 1];
let currentIndex = -1;
let attempt = 0;
let score = 0;
let completed = 0;
let wrongGuesses = new Set();
let questionOrder = [];
let currentOrderPos = -1;
const achievementStatus = document.getElementById("achievement-status");

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

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
  completed = Number.isNaN(savedCompleted) ? 0 : Math.min(savedCompleted, questionBank.length);
  updateScore();
}

function updateScore() {
  currentScore.textContent = score.toString();
  completedCount.textContent = completed.toString();
  levelText.textContent = Math.min(20, Math.floor(score / 5000) + 1).toString();

  const trophies = [];
  if (completed >= 10) trophies.push("🎖️ 10 klara");
  if (completed >= 25) trophies.push("🏆 25 klara");
  if (completed >= 50) trophies.push("👑 50 klara");
  achievementStatus.textContent = trophies.length > 0 ? trophies.join(" - ") : "Inga troféer än";

  const bar = document.getElementById("progress-bar");
  if (bar) {
    bar.style.width = `${Math.min(100, Math.round((completed / questionBank.length) * 100))}%`;
  }
}

function getLearningHint(q, currentAttempt) {
  const themeTips = {
    homes: [
      "Läs stycket om hem igen och markera ord som beskriver boenden.",
      "Jämför person och plats noggrant och uteslut sådant som hör till någon annan."
    ],
    family: [
      "Leta efter familjeord som mother, father, brother, sister, mum och dad.",
      "Räkna personerna eller jämför när de bor tillsammans."
    ],
    vocabulary: [
      "Tänk på vilket alternativ som bäst förklarar ordet i textens sammanhang.",
      "Prova att utesluta svar som inte beskriver samma sorts sak."
    ],
    space: [
      "Läs rymdstycket långsamt och ringa in siffror, faktaord och viktiga begrepp.",
      "Fundera på vad astronauter behöver för att kunna leva och arbeta i rymden."
    ],
    nature: [
      "Jämför naturorden noga och tänk på skillnaden mellan bär, svamp och växter.",
      "Leta efter ord som beskriver blad, färg eller hur växten ändras på vintern."
    ],
    "space story": [
      "Följ händelserna i rätt ordning och tänk på vad som händer före, under och efter testet.",
      "Leta efter känsloord, faror och vad Adhar gör för att klara uppdraget."
    ],
    feelings: [
      "Leta efter känsloord i texten och jämför dem med svarsalternativen.",
      "Fundera på hur någon brukar känna sig inför något svårt och farligt."
    ],
    scouts: [
      "Läs skogsstycket igen och följ vad grupperna gör steg för steg.",
      "Markera namn, färger och bärsorter innan du väljer svar."
    ],
    school: [
      "Leta efter vem som är på skolan och vem som är hemma, och varför.",
      "Jämför tidord som one Friday och the day before för att förstå händelsen."
    ],
    hobbies: [
      "Tänk på vilken aktivitet som hör ihop med varje barn i texten.",
      "Jämför hobbyerna och stryk sådant som tillhör någon annan person."
    ]
  };

  const tipSet = themeTips[q.theme] || [
    "Läs frågan igen och leta efter nyckelord i texten.",
    "Pröva att utesluta svar som inte passar sammanhanget."
  ];

  if (currentAttempt === 1) return tipSet[0];
  if (currentAttempt === 2 && q.hint) return q.hint;
  return tipSet[Math.min(1, tipSet.length - 1)];
}

function showQuestion(orderPosition) {
  currentOrderPos = orderPosition;
  currentIndex = questionOrder[orderPosition];
  attempt = 0;
  wrongGuesses.clear();
  const q = questionBank[currentIndex];
  questionTitle.textContent = `${q.id}. ${q.question}`;
  hint.textContent = "Behöver du hjälp? Om svaret blir fel får du ett tips som hjälper dig att tänka vidare.";
  feedback.textContent = "";
  attemptInfo.textContent = "Försök: 0 av 4";

  answersEl.innerHTML = "";
  q.options.forEach((option, i) => {
    const btn = document.createElement("button");
    btn.className = "btn";
    btn.textContent = option;
    btn.onclick = () => selectAnswer(i);
    answersEl.appendChild(btn);
  });

  if ('speechSynthesis' in window) {
    document.getElementById('speakButton').disabled = false;
  }

  nextButton.disabled = true;
}

function selectAnswer(index) {
  const q = questionBank[currentIndex];
  attempt += 1;
  attemptInfo.textContent = `Försök: ${attempt} av 4`;

  if (q.answer === index) {
    const add = points[Math.min(attempt - 1, points.length - 1)];
    score += add;
    completed += 1;
    const msg = `Rätt! +${add} poäng.`;
    feedback.textContent = msg;
    feedback.className = "feedback correct";

    disableAnswers();
    nextButton.disabled = false;
    persistProgress();
    updateScore();

    if (completed >= questionBank.length) {
      questionTitle.textContent = "Bra jobbat! Alla 50 uppdrag klara! 🎉";
      hint.textContent = "Spelet är klart. Klicka Nollställ för att spela igen.";
      nextButton.disabled = true;
      return;
    }
  } else {
    wrongGuesses.add(index);
    feedback.textContent = "Inte riktigt ännu. Läs tipset och försök igen!";
    feedback.className = "feedback wrong";
    hint.textContent = `Tips: ${getLearningHint(q, attempt)}`;
    if (attempt >= 4) {
      feedback.textContent = `Inga fler försök. Rätt svar: ${q.options[q.answer]}`;
      disableAnswers();
      nextButton.disabled = false;
    }
  }
}

function disableAnswers() {
  const buttons = answersEl.querySelectorAll("button");
  buttons.forEach((btn) => (btn.disabled = true));
}

function speakQuestion() {
  if (!('speechSynthesis' in window)) return;
  const q = questionBank[currentIndex];
  if (!q) return;
  const utterance = new SpeechSynthesisUtterance(q.question);
  utterance.lang = 'en-US';
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}

function nextQuestion() {
  if (completed >= questionBank.length) return;
  let nextOrder = currentOrderPos + 1;
  if (nextOrder >= questionBank.length) {
    questionTitle.textContent = "Bra jobbat! Alla 50 uppdrag klara! 🎉";
    hint.textContent = "Spelet är klart. Klicka Nollställ för att spela igen.";
    nextButton.disabled = true;
    return;
  }
  showQuestion(nextOrder);
}

function startQuest() {
  if (questionBank.length === 0) return;
  questionOrder = shuffle(Array.from({ length: questionBank.length }, (_, i) => i));
  currentOrderPos = -1;
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
  feedback.textContent = "Framsteg nollställs. Tryck Starta uppdrag för att börja igen.";
  feedback.className = "feedback";
  questionTitle.textContent = "Tryck på Start för att börja ditt äventyr 🎮";
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

document.getElementById("speakButton").addEventListener("click", () => {
  speakQuestion();
});

resetButton.addEventListener("click", () => {
  if (confirm("Är du säker på att du vill nollställa framstegen?")) {
    resetProgress();
  }
});

loadProgress();
