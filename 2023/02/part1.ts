import { readLines } from "../../utils/input";

const games = readLines("input.txt");

const limits = {
  red: 12,
  green: 13,
  blue: 14,
} as const;

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
      }, new Map<"green" | "red" | "blue", number>());
    }),
  };
};

const isValidGame = (game: {
  gameId: number;
  pulls: Map<"green" | "red" | "blue", number>[];
}) => {
  const r = Math.max(...game.pulls.map((p) => p.get("red") ?? 0));
  const g = Math.max(...game.pulls.map((p) => p.get("green") ?? 0));
  const b = Math.max(...game.pulls.map((p) => p.get("blue") ?? 0));

  if (r <= limits.red && g <= limits.green && b <= limits.blue) {
    return true;
  }
  return false;
};

const validGames = games.map(parseLine).filter(isValidGame);

const sum = validGames.reduce((prev, curr) => prev + curr.gameId, 0);
console.log(sum);
