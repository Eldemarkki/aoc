import { readLines } from "../../utils/input";
const lines = readLines() as string[];

const grid = lines.map(line => line.split("").map(Number));

const getNodes = (dir: "horizontal" | "vertical", otherAxis: number, start: number, end: number) => {
  if (dir === "horizontal") {
    return grid[otherAxis].slice(start, end);
  }
  else {
    return grid.slice(start, end).map(row => row[otherAxis]);
  }
};

const getAll = (x: number, y: number) => {
  return {
    top: getNodes("vertical", x, 0, y),
    bottom: getNodes("vertical", x, y + 1, grid.length),
    left: getNodes("horizontal", y, 0, x),
    right: getNodes("horizontal", y, x + 1, grid[0].length),
  }
}

const isVisible = (x: number, y: number) => {
  const thisNumber = grid[y][x];
  const { top, bottom, left, right } = getAll(x, y);
  return top.every(v => v < thisNumber) ||
    bottom.every(v => v < thisNumber) ||
    left.every(v => v < thisNumber) ||
    right.every(v => v < thisNumber);
}

let answer = 0;
for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[0].length; x++) {
    if (isVisible(x, y)) {
      answer++;
    }
  }
}

console.log(answer)
