import { readLines } from "../../utils/input";

const lines = readLines("input.txt");

const stretchedLines: string[] = [];

for (const line of lines) {
  if (line.includes("#")) {
    stretchedLines.push(line);
  } else {
    stretchedLines.push(line);
    stretchedLines.push(line);
  }
}

const columnHasGalaxy = (column: number) => {
  return lines.findIndex((l) => l[column] === "#") !== -1;
};

const columnsToStretch = lines[0]
  .split("")
  .map((_, i) => i)
  .filter((i) => !columnHasGalaxy(i));

columnsToStretch.reverse();

columnsToStretch.forEach((col) => {
  for (let i = 0; i < stretchedLines.length; i++) {
    const element = stretchedLines[i].split("");
    element.splice(col, 0, ".");
    stretchedLines[i] = element.join("");
  }
});

type Point = {
  x: number;
  y: number;
};

const galaxyCoordinates: Point[] = [];

for (let y = 0; y < stretchedLines.length; y++) {
  const line = stretchedLines[y];
  for (let x = 0; x < line.length; x++) {
    const char = line[x];
    if (char === "#") {
      galaxyCoordinates.push({
        x,
        y,
      });
    }
  }
}

const getDistance = (a: Point, b: Point) => {
  const xDiff = Math.abs(a.x - b.x);
  const yDiff = Math.abs(a.y - b.y);

  // return xDiff + yDiff;

  const min = Math.min(xDiff, yDiff);
  const max = Math.max(xDiff, yDiff);

  return min + max;

  // return min + max; // - (min === 0 || min * 2 > max ? 1 : 0);
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
