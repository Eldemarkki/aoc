const { readLines } = require("../../utils/input");

const lines = readLines("input.txt").map(line => line.trim().split(" | "))

let count = 0;
for (let i = 0; i < lines.length; i++) {
  count += lines[i][1].split(" ").filter(l => l.length == 2 || l.length == 4 || l.length == 3 || l.length == 7).length;
}
console.log(count)