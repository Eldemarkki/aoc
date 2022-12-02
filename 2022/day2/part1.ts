import { readLines } from "../../utils/input";
const lines = readLines();

let score = 0;

const wins = {
  "A X": 3,
  "A Y": 6,
  "A Z": 0,

  "B X": 0,
  "B Y": 3,
  "B Z": 6,

  "C X": 6,
  "C Y": 0,
  "C Z": 3,
}

const s = {
  "X": 1,
  "Y": 2,
  "Z": 3,
}

for (const line of lines) {
  score += wins[line.trim()] + s[line.trim()[2]]
}

console.log(score)