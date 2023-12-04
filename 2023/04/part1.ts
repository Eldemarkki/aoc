import { readLines } from "../../utils/input";

const lines = readLines("input.txt");

const parseLint = (line: string) => {
  const [_, data] = line.split(": ");
  const [winningStr, numsStr] = data.split(" | ");
  const winning = winningStr.trim().split(/\s+/).map(Number);
  const nums = numsStr.trim().split(/\s+/).map(Number);

  return {
    winning,
    nums,
  };
};

const getPoints = (row: { winning: number[]; nums: number[] }) => {
  const matches = row.winning.filter((w) => row.nums.includes(w)).length;
  if (matches === 0) return 0;
  return 2 ** (matches - 1);
};

console.log(
  lines
    .map(parseLint)
    .map(getPoints)
    .reduce((a, b) => a + b, 0)
);
