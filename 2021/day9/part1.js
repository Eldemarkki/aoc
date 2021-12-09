const { readLines } = require("../../utils/input");

const data = readLines("input.txt").map(line => line.trim().split("").map(Number))
const height = data.length;
const width = data[0].length;

const offsets = [[1, 0], [0, -1], [-1, 0], [0, 1]]

const getPoint = (x, y) => {
  if (x < 0 || x >= width || y < 0 || y >= height) return 10000000000;
  return data[y][x]
}

let sum = 0;
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const isLowPoint = offsets.every(offset => {
      return getPoint(x, y) < getPoint(x + offset[0], y + offset[1]);
    })
    if (isLowPoint) {
      sum += getPoint(x, y) + 1;
    }
  }
}

console.log(sum)