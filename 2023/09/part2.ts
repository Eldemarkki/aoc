import { readLines } from "../../utils/input";

const lines = readLines("input.txt");

const rows = lines.map((l) => {
  const r = l.split(" ").map(Number);
  r.reverse();
  return r;
});

const predictNext = (history: number[]) => {
  const maxDepth = history.length - 1;
  const depths: number[][] = [history];

  for (let depth = 0; depth < maxDepth; depth++) {
    const nextDepth = depths[depth].reduce<number[]>((prev, curr, i, data) => {
      if (i === data.length - 1) return prev;
      prev.push(data[i + 1] - data[i]);
      return prev;
    }, []);

    depths.push(nextDepth);
    if (nextDepth.every((x) => x === 0)) {
      break;
    }
  }

  return depths.reduce((prev, d) => prev + d[d.length - 1], 0);
};

const sum = rows.map(predictNext).reduce((a, b) => a + b, 0);
console.log(sum);
