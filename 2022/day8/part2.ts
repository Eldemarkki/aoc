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

const countUntilLarger = (num: number, arr: number[]) => {
  let count = 1;
  let i = 0;
  while (arr[i] < num) {
    i++;
    count++;
  }
  return Math.min(count, arr.length);
}

const getScenicScore = (x: number, y: number) => {
  const thisNumber = grid[y][x];
  const { top, bottom, left, right } = getAll(x, y);
  const topScore = countUntilLarger(thisNumber, top.reverse());
  const bottomScore = countUntilLarger(thisNumber, bottom);
  const leftScore = countUntilLarger(thisNumber, left.reverse());
  const rightScore = countUntilLarger(thisNumber, right);
  return topScore * bottomScore * leftScore * rightScore;
}

let answer = 0;
for (let y = 0; y < grid.length; y++) {
  for (let x = 0; x < grid[0].length; x++) {
    const score = getScenicScore(x, y);
    if (score > answer) {
      answer = score;
    }
  }
}

console.log(answer)
