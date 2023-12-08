import { readLines } from "../../utils/input";

const lines = readLines("input.txt");

const pattern = lines[0].split("");

const nodes = new Map<string, string>();
const nodeLines = lines.slice(2).map((line) => {
  const source = line.substring(0, 3);
  const left = line.substring(7, 10);
  const right = line.substring(12, 15);

  nodes.set(source + " L", left);
  nodes.set(source + " R", right);

  return {
    source,
    left,
    right,
  };
});

// let total = 0;
let current = nodeLines.filter((l) => l.source[2] === "A").map((l) => l.source);

const getFirstZ = (node: string) => {
  let i = 0;
  let c = node;
  while (true) {
    const p = pattern[i % pattern.length];
    c = nodes.get(c + " " + p)!;
    i++;
    if (c[2] === "Z") break;
  }

  return i;
};

const zs = current.map((c) => ({ node: c, firstZ: getFirstZ(c) }));

const gcd = (a: number, b: number) => {
  if (b == 0) return a;
  return gcd(b, a % b);
};

const lcm = (arr: number[]) => {
  let x = arr[0];
  for (let i = 1; i < arr.length; i++) {
    x = (arr[i] * x) / gcd(arr[i], x);
  }

  return x;
};

console.log(lcm(zs.map((z) => z.firstZ)));
