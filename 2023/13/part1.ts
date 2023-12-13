import { readLines } from "../../utils/input";

const patterns = readLines("input.txt").join("\n").split("\n\n");

const isMirroredHorizontally = (pattern: string, index: number) => {
  const lines = pattern.split("\n");
  const sum = index + index + 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const mirroredIndex = sum - i;
    if (mirroredIndex < 0 || mirroredIndex >= lines.length) continue;

    const mirroredLine = lines[mirroredIndex];
    if (mirroredLine !== line) {
      return false;
    }
  }
  return true;
};

const isMirroredVertically = (pattern: string, index: number) => {
  const lines = pattern.split("\n");
  const sum = index + index + 1;
  for (let i = 0; i < lines[0].length - 1; i++) {
    const mirroredIndex = sum - i;
    const firstColumn = lines.reduce((a, b) => a + b[i], "");
    if (mirroredIndex < 0 || mirroredIndex >= lines[0].length) continue;

    const secondColumn = lines.reduce((a, b) => a + b[mirroredIndex], "");
    if (firstColumn !== secondColumn) {
      return false;
    }
  }

  return true;
};

const findMirror = (
  pattern: string
): {
  direction: "horizontal" | "vertical";
  index: number;
} => {
  const lines = pattern.split("\n");

  // Test horizontally
  const possibleHorizontalPositions = lines
    .map((line, index, data) => {
      if (index >= data.length - 1) return undefined;
      if (line === data[index + 1]) {
        return index;
      }

      return undefined;
    })
    .filter((x): x is number => x !== undefined);

  if (possibleHorizontalPositions.length > 0) {
    for (const index of possibleHorizontalPositions) {
      if (isMirroredHorizontally(pattern, index)) {
        return {
          direction: "horizontal",
          index,
        };
      }
    }
  }

  // Test vertically
  const possibleVerticalPositions = lines[0]
    .split("")
    .map((_, columnIndex) => {
      if (columnIndex >= lines[0].length - 1) return undefined;
      const firstColumn = lines.reduce((a, b) => a + b[columnIndex], "");
      const secondColumn = lines.reduce((a, b) => a + b[columnIndex + 1], "");
      if (firstColumn === secondColumn) {
        return columnIndex;
      }

      return undefined;
    })
    .filter((x): x is number => x !== undefined);

  if (possibleVerticalPositions.length > 0) {
    for (const index of possibleVerticalPositions) {
      if (isMirroredVertically(pattern, index)) {
        return {
          direction: "vertical",
          index,
        };
      }
    }
  }

  throw new Error("Didn't find mirror");
};

const mirrors = patterns.map((p) => findMirror(p));

const total = mirrors.reduce((s, c) => {
  return s + (c.direction === "horizontal" ? (c.index + 1) * 100 : c.index + 1);
}, 0);

console.log(total);
