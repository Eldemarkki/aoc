const { readLines } = require("../../utils/input");

const lines = readLines()

let p1pos = Number(lines[0].split(": ")[1])
let p2pos = Number(lines[1].split(": ")[1])
let p1score = 0
let p2score = 0
let diceRoller = 1
let round = 0;

const moveSteps = (pos, steps) => (pos - 1 + steps) % 10 + 1
const rollDice = () => {
  const original = diceRoller
  diceRoller = diceRoller % 100 + 1
  return original
}

while (p1score < 1000 && p2score < 1000) {
  const diceSum = rollDice() + rollDice() + rollDice()

  if (round % 2 === 0) {
    p1pos = moveSteps(p1pos, diceSum);
    p1score += p1pos
  } else {
    p2pos = moveSteps(p2pos, diceSum);
    p2score += p2pos
  }

  round++;
}

console.log(Math.min(p1score, p2score) * round * 3)