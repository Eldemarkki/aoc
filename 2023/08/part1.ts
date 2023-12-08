import { readLines } from "../../utils/input";

const lines = readLines("input.txt");

const pattern = lines[0].split("");

const nodes = new Map<string, string>();
lines.slice(2).forEach((line) => {
  const source = line.substring(0, 3);
  const left = line.substring(7, 10);
  const right = line.substring(12, 15);

  nodes.set(source + " L", left);
  nodes.set(source + " R", right);
});

let total = 0;
let current = "AAA";
while (true) {
  const p = pattern[total % pattern.length];
  current = nodes.get(current + " " + p)!;
  total++;
  if (current === "ZZZ") {
    break;
  }
}

console.log(total);
