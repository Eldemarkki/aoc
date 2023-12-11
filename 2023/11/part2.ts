import { readLines } from "../../utils/input";

const lines = readLines("input.txt");

const columnHasGalaxy = (column: number) => {
  return lines.findIndex((l) => l[column] === "#") !== -1;
};

const columnsToStretch = lines[0]
  .split("")
  .map((_, i) => i)
  .filter((i) => !columnHasGalaxy(i));

columnsToStretch.reverse();

type Point = {
  x: number;
  y: number;
};

const galaxyCoordinates: Point[] = [];

const scale = 1000000;

const getOffsetY = (y: number) => {
  let total = 0;
  for (let i = 0; i < y; i++) {
    if (lines[i].includes("#")) {
      total++;
    } else {
      total += scale;
    }
  }
  return total;
};

const getOffsetX = (x: number) => {
  let total = 0;
  for (let i = 0; i < x; i++) {
    if (columnHasGalaxy(i)) {
      total++;
    } else {
      total += scale;
    }
  }

  return total;
};

for (let y = 0; y < lines.length; y++) {
  const line = lines[y];
  for (let x = 0; x < line.length; x++) {
    const char = line[x];
    if (char === "#") {
      galaxyCoordinates.push({
        x: getOffsetX(x) + 1,
        y: getOffsetY(y) + 1,
      });
    }
  }
}

const getDistance = (a: Point, b: Point) => {
  const xDiff = Math.abs(a.x - b.x);
  const yDiff = Math.abs(a.y - b.y);

  const min = Math.min(xDiff, yDiff);
  const max = Math.max(xDiff, yDiff);

  return min + max;
};

const distances = new Map<string, number>();

for (let i = 0; i < galaxyCoordinates.length; i++) {
  const a = galaxyCoordinates[i];
  for (let j = 0; j < galaxyCoordinates.length; j++) {
    if (i === j) continue;

    const b = galaxyCoordinates[j];
    const d = getDistance(a, b);

    distances.set(`${Math.min(i + 1, j + 1)}-${Math.max(i + 1, j + 1)}`, d);
  }
}

console.log([...distances.values()].reduce((a, b) => a + b, 0));
