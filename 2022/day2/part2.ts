import { readLines } from "../../utils/input";
const lines = readLines();

let score = 0;

const wins = {
  "A X": 0 + 3,
  "A Y": 3 + 1,
  "A Z": 6 + 2,

  "B X": 0 + 1,
  "B Y": 3 + 2,
  "B Z": 6 + 3,

  "C X": 0 + 2,
  "C Y": 3 + 3,
  "C Z": 6 + 1,
}

for (const line of lines) {
  score += wins[line.trim()]
}

console.log(score)