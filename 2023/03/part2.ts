import { readLines } from "../../utils/input";

const lines = readLines("input.txt").map((l) => l + ".");

const chars = lines.map((x) => x.split(""));

const numRanges: {
  y: number;
  x: [number, number];
}[] = [];

for (let y = 0; y < lines.length; y++) {
  const row = lines[y];

  let isInNumber = false;
  let nText = "";
  for (let x = 0; x < row.length; x++) {
    const n = Number(row[x]);
    if (!isNaN(n)) {
      isInNumber = true;
      nText += row[x];
    } else {
      isInNumber = false;
    }

    if (nText.length > 0 && !isInNumber) {
      numRanges.push({
        x: [x - nText.length, x - 1],
        y,
      });
      nText = "";
    }
  }
}

const isSymbol = (x: string) => {
  if (x === ".") return false;
  if (!isNaN(Number(x))) return false;

  return true;
};

const touchesSymbol = ({ x, y }: { x: [number, number]; y: number }) => {
  const neighborCoordinates: [number, number][] = [];

  neighborCoordinates.push([x[0] - 1, y + 1]);
  neighborCoordinates.push([x[0] - 1, y]);
  neighborCoordinates.push([x[0] - 1, y - 1]);
  neighborCoordinates.push([x[1] + 1, y + 1]);
  neighborCoordinates.push([x[1] + 1, y]);
  neighborCoordinates.push([x[1] + 1, y - 1]);

  for (let i = x[0]; i <= x[1]; i++) {
    neighborCoordinates.push([i, y - 1]);
    neighborCoordinates.push([i, y + 1]);
  }

  return neighborCoordinates
    .filter((c) => 0 <= c[0] && c[0] <= lines[0].length)
    .filter((c) => 0 <= c[1] && c[1] < lines.length)
    .some((c) => {
      const i = isSymbol(chars[c[1]][c[0]]);
      return i;
    });
};

const getNumber = (range: { x: [number, number]; y: number }) =>
  Number(lines[range.y].substring(range.x[0], range.x[1] + 1));

const findRangeTouching = (x: number, y: number) => {
  return numRanges.find((r) => r.y === y && r.x[0] <= x && x <= r.x[1]);
};

let sum = 0;
for (let y = 0; y < lines.length; y++) {
  const row = lines[y];
  for (let x = 0; x < row.length; x++) {
    const char = row[x];
    let ranges: {
      x: [number, number];
      y: number;
    }[] = [];
    if (char === "*") {
      for (let yOff = -1; yOff <= 1; yOff++) {
        for (let xOff = -1; xOff <= 1; xOff++) {
          if (!isNaN(Number(lines[y + yOff][x + xOff]))) {
            const range = findRangeTouching(x + xOff, y + yOff);
            if (!range) continue;
            if (
              !ranges.some(
                (r) =>
                  r.x[0] === range.x[0] &&
                  r.x[1] === range.x[1] &&
                  r.y === range.y
              )
            ) {
              ranges.push(range!);
            }
          }
        }
      }
    }

    if (ranges.length === 2) {
      const n1 = getNumber(ranges[0]);
      const n2 = getNumber(ranges[1]);
      sum += n1 * n2;
    }
  }
}

console.log(sum);
