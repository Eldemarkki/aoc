const { readLines } = require("../../utils/input");
const lines = readLines();

const elves = []
let c = 0
for (const line of lines) {
  if (line.trim() === "") {
    elves.push(c)
    c = 0
  }
  else {
    c += Number(line)
  }
}

elves.sort((a, b) => b - a);

console.log(elves[0] + elves[1] + elves[2])
