const seedQuestions = [
  {question: "Välj rätt pluralform:", base: "child", options: ["childs", "childes", "children", "childen", "childer"], answer: 2},
  {question: "Vad är dåtidsformen av 'go' ?", base: "go", options: ["goed", "went", "gone", "goes", "goned"], answer: 1},
  {question: "Vilket pronomen passar till 'Sofia and I':", base: "we", options: ["he", "they", "we", "us", "it"], answer: 2},
  {question: "Vilket är ett adjektiv?", base: "fun", options: ["quickly", "fun", "run", "happily", "will"], answer: 1},
  {question: "Välj rätt artikel:", base: "apple", options: ["a", "an", "the", "no", "this"], answer: 1},
  {question: "Vilket är ett verb?", base: "read", options: ["book", "read", "blue", "beauty", "happy"], answer: 1},
  {question: "Välj motsatsen till 'hot':", base: "hot", options: ["cold", "fast", "small", "loud", "dark"], answer: 0},
  {question: "Vad betyder 'hungry'?", base: "hungry", options: ["tired", "thirsty", "full", "hungry", "angry"], answer: 3},
  {question: "Vilket är ett frågeord?", base: "where", options: ["where", "fast", "nice", "many", "tall"], answer: 0},
  {question: "Välj meningen som är korrekt:", base: "I play football", options: ["I plays football.", "I playing football.", "I play football.", "I played football.", "I to play football."], answer: 2},
  {question: "Vilket ord betyder ungefär som 'big'?", base: "big", options: ["small", "huge", "soft", "quiet", "empty"], answer: 1},
  {question: "Vilket ord är ett substantiv?", base: "school", options: ["run", "school", "yellow", "quick", "sleep"], answer: 1},
  {question: "Välj rätt form i 'she ___ a book.'", base: "read", options: ["reads", "readed", "read", "reading", "have"], answer: 0},
  {question: "Vilket ord är en färg?", base: "green", options: ["green", "walk", "fast", "near", "after"], answer: 0},
  {question: "Välj rätt dåtidsform av 'have':", base: "have", options: ["had", "have", "haved", "having", "has"], answer: 0},
  {question: "Vilken är rätt framtidsform: 'I ___ play.'", base: "will", options: ["will", "was", "is", "do", "did"], answer: 0},
  {question: "Välj rätt sammandragning för 'I am':", base: "I'm", options: ["I am", "Im", "I'am", "I'm", "Iam"], answer: 3},
  {question: "Vilket är ett tidsord?", base: "today", options: ["today", "happy", "dog", "green", "easily"], answer: 0},
  {question: "Välj en hälsosam matvara:", base: "apple", options: ["apple", "candy", "cookie", "chips", "soda"], answer: 0},
  {question: "Vad är motsatsen till 'sleepy'?", base: "awake", options: ["sleepy", "awake", "tired", "warm", "cold"], answer: 1}
];

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const questionBank = Array.from({ length: 100 }, (_, i) => {
  const seed = seedQuestions[i % seedQuestions.length];
  const variation = Math.floor(i / seedQuestions.length) + 1;
  const shuffledOptions = shuffle(seed.options);
  const right = shuffledOptions.indexOf(seed.options[seed.answer]);
  return {
    id: i + 1,
    question: `${seed.question} (Quest ${i + 1})`,
    options: shuffledOptions,
    answer: right,
    hint: `You are on quest ${i + 1}; think of simple grammar and vocabulary!`,
    theme: `${seed.base}`
  };
});
