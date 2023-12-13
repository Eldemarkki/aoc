import { readLines } from "../../utils/input";

const patterns = readLines("input.txt").join("\n").split("\n\n");

const countHorizontalSmudges = (pattern: string, index: number) => {
  const lines = pattern.split("\n");
  const sum = index + index + 1;
  let smudges = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const mirroredIndex = sum - i;
    if (
      mirroredIndex < 0 ||
      mirroredIndex >= lines.length ||
      mirroredIndex > index
    )
      continue;

    const mirroredLine = lines[mirroredIndex];

    const lineSmudges = line
      .split("")
      .filter((char, index) => mirroredLine[index] !== char).length;
    smudges += lineSmudges;
  }

  return smudges;
};

const countVerticalSmudges = (pattern: string, index: number) => {
  const lines = pattern.split("\n");
  const sum = index + index + 1;
  let smudges = 0;

  for (let i = 0; i < lines[0].length; i++) {
    const mirroredIndex = sum - i;
    const firstColumn = lines.reduce((a, b) => a + b[i], "");
    if (
      mirroredIndex < 0 ||
      mirroredIndex >= lines[0].length ||
      mirroredIndex > index
    )
      continue;

    const secondColumn = lines.reduce((a, b) => a + b[mirroredIndex], "");

    const lineSmudges = firstColumn
      .split("")
      .filter((char, index) => secondColumn[index] !== char).length;

    smudges += lineSmudges;
  }

  return smudges;
};

const findMirror = (pattern: string) => {
  const lines = pattern.split("\n");

  const possibilities: {
    direction: "horizontal" | "vertical";
    index: number;
  }[] = [];

  for (let index = 0; index < lines.length; index++) {
    const smudges = countHorizontalSmudges(pattern, index);
    if (smudges === 1) {
      possibilities.push({
        direction: "horizontal",
        index,
      });
    }
  }

  for (let index = 0; index < lines[0].length; index++) {
    const smudges = countVerticalSmudges(pattern, index);
    if (smudges === 1) {
      possibilities.push({
        direction: "vertical",
        index,
      });
    }
  }

  if (possibilities.length !== 1) {
    throw new Error("Not 1 possibility");
  }

  return possibilities[0];
};

const mirrors = patterns.map((p) => findMirror(p));
const total = mirrors.reduce((s, c) => {
  return s + (c.direction === "horizontal" ? (c.index + 1) * 100 : c.index + 1);
}, 0);

console.log(total);
