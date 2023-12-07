import { readLines } from "../../utils/input";

const lines = readLines("input.txt");

const cards = [
  "A",
  "K",
  "Q",
  "J",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
] as const;

type Card = (typeof cards)[number];

const getType = (cards: Card[]) => {
  const sorted = [...cards];
  sorted.sort();

  const map = new Map<Card, number>();
  cards.forEach((c) => map.set(c, (map.get(c) ?? 0) + 1));
  const vals = [...map.values()];
  vals.sort();

  if (vals.length === 1) return 6 as const;
  if (vals.length === 2) {
    if (vals[0] === 1) return 5 as const;
    if (vals[0] === 2) return 4 as const;
  }
  if (vals.length === 3) {
    if (vals[0] === 1 && vals[1] === 1) return 3 as const;
    if (vals[0] === 1 && vals[1] === 2) return 2 as const;
  }
  if (vals.length === 4) {
    return 1 as const;
  }
  if (vals.length === 5) return 0 as const;
  throw new Error("Couldn't get type for " + cards);
};

const input = lines.map((line) => {
  const s = line.split(" ");
  return {
    hand: s[0].split("") as Card[],
    bid: Number(s[1]),
  };
});

input.sort((a, b) => {
  const typeA = getType(a.hand);
  const typeB = getType(b.hand);
  if (typeA > typeB) {
    return 1;
  } else if (typeB > typeA) {
    return -1;
  } else {
    for (let i = 0; i < 5; i++) {
      const cardA = a.hand[i];
      const cardB = b.hand[i];

      if (cardA === cardB) continue;
      else if (cards.indexOf(cardA) < cards.indexOf(cardB)) return 1;
      else if (cards.indexOf(cardB) < cards.indexOf(cardA)) return -1;
    }
  }

  throw new Error("Error sorting");
});

const total = input.reduce((prev, curr, i) => prev + curr.bid * (i + 1), 0);

console.log(total);
