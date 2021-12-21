const { readLines } = require("../../utils/input");

const minScore = 21

const cache = {}

const countWins = (p1pos, p1score, p2pos, p2score) => {
  if (p1score >= minScore) return [1, 0]
  if (p2score >= minScore) return [0, 1]

  if (cache.hasOwnProperty([p1pos, p1score, p2pos, p2score])) {
    return [...cache[[p1pos, p1score, p2pos, p2score]]]
  }

  let wins = [0, 0]
  for (let x = 1; x <= 3; x++) {
    for (let y = 1; y <= 3; y++) {
      for (let z = 1; z <= 3; z++) {
        const new_p1pos = (p1pos + x + y + z) % 10;
        const new_p1score = p1score + new_p1pos + 1;
        const newWins = countWins(p2pos, p2score, new_p1pos, new_p1score)

        wins = [wins[0] + newWins[1], wins[1] + newWins[0]]
      }
    }
  }

  cache[[p1pos, p1score, p2pos, p2score]] = [...wins];

  return [...wins];
}

const lines = readLines()
let p1pos = Number(lines[0].split(": ")[1])
let p2pos = Number(lines[1].split(": ")[1])

const wins = countWins(p1pos - 1, 0, p2pos - 1, 0)
console.log(Math.max(...wins))