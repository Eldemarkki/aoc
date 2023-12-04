import { readLines } from "../../utils/input";

const lines = readLines("input.txt");

const parseLine = (line: string) => {
  const [cardInfo, data] = line.split(": ");
  const [winningStr, numsStr] = data.split(" | ");
  const winning = winningStr.trim().split(/\s+/).map(Number);
  const nums = numsStr.trim().split(/\s+/).map(Number);

  return {
    winning,
    nums,
    id: Number(cardInfo.replace("Card ", "")),
  };
};

const cardData = new Map<
  number,
  {
    winning: number[];
    nums: number[];
    id: number;
  }
>();
const cardCounts = new Map<number, number>();

lines.map(parseLine).forEach((l) => {
  cardData.set(l.id, l);
  cardCounts.set(l.id, 1);
});

const getWins = (row: number) => {
  const card = cardData.get(row)!;
  const matches = card.winning.filter((w) => card.nums.includes(w)).length;

  return Array.from({ length: matches })
    .fill(0)
    .map((_x, i) => card.id + i + 1);
};

for (let i = 0; i < cardData.size; i++) {
  const wins = getWins(i + 1);
  for (const win of wins) {
    cardCounts.set(
      win,
      (cardCounts.get(win) ?? 1) + (cardCounts.get(i + 1) ?? 1)
    );
  }
}

console.log([...cardCounts.entries()].reduce((sum, [_, b]) => sum + b, 0));
