import { readLines } from "../../utils/input";

const games = readLines("input.txt");

const parseLine = (line: string) => {
  const split = line.split(": ", 2);
  const gameId = Number(split[0].replace("Game ", ""));

  const pulls = split[1].split("; ");

  return {
    gameId,
    pulls: pulls.map((pull) => {
      return pull.split(", ").reduce((prev, curr) => {
        const [num, color] = curr.split(" ");
        prev.set(color as any, Number(num));
        return prev;
      }, new Map<"red" | "green" | "blue", number>());
    }),
  };
};

const powers = games.map(parseLine).map((game) => {
  const r = Math.max(...game.pulls.map((p) => p.get("red") ?? 0));
  const g = Math.max(...game.pulls.map((p) => p.get("blue") ?? 0));
  const b = Math.max(...game.pulls.map((p) => p.get("green") ?? 0));
  return r * g * b;
});

const sum = powers.reduce((prev, curr) => prev + curr, 0);
console.log(sum);
