import { readLines } from "../../utils/input";
const lines = readLines() as string[];

let head = { x: 0, y: 0 };
let tail = { x: 0, y: 0 };

let visitedPositions = {};

visitedPositions[`${tail.x},${tail.y}`] = true;

const calcDist = (a: { x: number, y: number }, b: { x: number, y: number }) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

for (const line of lines) {
  const [direction, distanceStr] = line.split(" ");
  const distance = parseInt(distanceStr);

  const sign = (direction === "L" || direction === "D") ? -1 : 1;
  const x = (direction === "L" || direction === "R") ? "x" : "y";
  const y = (direction === "U" || direction === "D") ? "x" : "y";
  for (let i = 0; i < distance; i++) {
    head[x] += sign;

    if (calcDist(head, tail) >= 1.5) {
      // Find closest point in 3x3 square with least distance to head
      let minDist = Infinity;
      let minPoint = { x: 0, y: 0 };
      for (let x = tail.x - 1; x <= tail.x + 1; x++) {
        for (let y = tail.y - 1; y <= tail.y + 1; y++) {
          const point = { x, y };
          const dist = calcDist(head, point);
          if (dist < minDist) {
            minDist = dist;
            minPoint = point;
          }
        }
      }
      tail = minPoint;
    }

    console.log(head, tail)
    visitedPositions[`${tail.x},${tail.y}`] = true;
  }
}

console.log(Object.keys(visitedPositions).length)