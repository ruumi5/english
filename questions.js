const seedQuestions = [
  {question: "Choose the correct plural form:", base: "child", options: ["childs", "childes", "children", "childen", "childer"], answer: 2},
  {question: "What is the past tense of 'go' ?", base: "go", options: ["goed", "went", "gone", "goes", "goned"], answer: 1},
  {question: "Pick the correct pronoun for 'Sofia and I':", base: "we", options: ["he", "they", "we", "us", "it"], answer: 2},
  {question: "Which one is an adjective?", base: "fun", options: ["quickly", "fun", "run", "happily", "will"], answer: 1},
  {question: "Choose the correct article:", base: "apple", options: ["a", "an", "the", "no", "this"], answer: 1},
  {question: "Which is a verb?", base: "read", options: ["book", "read", "blue", "beauty", "happy"], answer: 1},
  {question: "Pick the opposite of 'hot':", base: "hot", options: ["cold", "fast", "small", "loud", "dark"], answer: 0},
  {question: "What does 'hungry' mean?", base: "hungry", options: ["tired", "thirsty", "full", "hungry", "angry"], answer: 3},
  {question: "Which is a question word?", base: "where", options: ["where", "fast", "nice", "many", "tall"], answer: 0},
  {question: "Select the sentence that is correct:", base: "I play football", options: ["I plays football.", "I playing football.", "I play football.", "I played football.", "I to play football."], answer: 2},
  {question: "Choose word with the same meaning as 'big':", base: "big", options: ["small", "huge", "soft", "quiet", "empty"], answer: 1},
  {question: "Which word is a noun?", base: "school", options: ["run", "school", "yellow", "quick", "sleep"], answer: 1},
  {question: "Pick the correct form for 'she ___ a book.'", base: "read", options: ["reads", "readed", "read", "reading", "have"], answer: 0},
  {question: "Which word is a color?", base: "green", options: ["green", "walk", "fast", "near", "after"], answer: 0},
  {question: "Choose the correct past form of 'have':", base: "have", options: ["had", "have", "haved", "having", "has"], answer: 0},
  {question: "Select correct for future: 'I ___ play.'", base: "will", options: ["will", "was", "is", "do", "did"], answer: 0},
  {question: "Pick the right contraction for 'I am':", base: "I'm", options: ["I am", "Im", "I'am", "I'm", "Iam"], answer: 3},
  {question: "Which is a time word?", base: "today", options: ["today", "happy", "dog", "green", "easily"], answer: 0},
  {question: "Choose a healthy food item:", base: "apple", options: ["apple", "candy", "cookie", "chips", "soda"], answer: 0},
  {question: "What is the opposite of 'sleepy'?", base: "awake", options: ["sleepy", "awake", "tired", "warm", "cold"], answer: 1}
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
