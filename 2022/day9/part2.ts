import { readLines } from "../../utils/input";
const lines = readLines() as string[];
const calcDist = (a: { x: number, y: number }, b: { x: number, y: number }) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

let visitedPositions = {};

const simulateStep = (headOriginal: { x: number, y: number }, tailOriginal: { x: number, y: number }, direction: "L" | "R" | "U" | "D", distance: number) => {
  const sign = (direction === "L" || direction === "D") ? -1 : 1;
  const x = (direction === "L" || direction === "R") ? "x" : "y";

  const head = { ...headOriginal };
  let tail = { ...tailOriginal };

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

    visitedPositions[`${tail.x},${tail.y}`] = true;
  }

  return { head, tail };
}

const rope = [
  { x: 2, y: 0 },
  { x: 1, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
  { x: 0, y: 0 },
]

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const [direction, distanceStr] = line.split(" ");

  let distance = parseInt(distanceStr);

  for (let d = 0; d < distance; d++) {
    for (let lineIndex = 0; lineIndex < rope.length - 1; lineIndex++) {
      const currentHead = { ...rope[lineIndex] };
      const currentTail = { ...rope[lineIndex + 1] };
      console.log(lineIndex, currentHead, currentTail)
      const { head: newHead, tail: newTail } = simulateStep(currentHead, currentTail, direction as any, 1);
      // console.log(rope, lineIndex, currentHead, newHead, currentTail, newTail)

      if (lineIndex === 0) rope[lineIndex] = newHead;

      // rope[lineIndex + 1] = newTail;

      if (lineIndex !== 1) {
        if (!(newTail.x === rope[lineIndex + 1].x && newTail.y === rope[lineIndex + 1].y)) {
          rope[lineIndex + 1] = newTail;
        }
      }

      console.log(lineIndex, rope)
    }

  }
}

console.log(Object.keys(visitedPositions).length);
