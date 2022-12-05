import { readLinesDontTrim } from "../../utils/input";
const lines = readLinesDontTrim() as string[];

const split = lines.findIndex((line) => line.trim() === "");

function chunkString(str: string, len: number) {
  const size = Math.ceil(str.length / len)
  const r = Array(size)
  let offset = 0

  for (let i = 0; i < size; i++) {
    r[i] = str.substring(offset, offset + len)
    offset += len
  }

  return r
}

const stacks: Record<number, string[]> = {}
for (let i = 0; i < split - 1; i++) {
  const line = lines[i]
  const crates = chunkString(line, 4).map((crate) => crate.trim().replace("[", "").replace("]", "")) ?? [];
  for (let j = 0; j < crates.length; j++) {
    const crate = crates[j];
    if (!stacks[j]) {
      stacks[j] = [];
    }
    if (crate !== "") {
      stacks[j] = [crate].concat(stacks[j]);
    }
  }
}

const stackCount = Object.keys(stacks).length

const instructions = lines.slice(split + 1).map((line) => {
  const splitted = line.trim().split(" ");
  return [Number(splitted[1]), Number(splitted[3]), Number(splitted[5])];
});

for (let i = 0; i < instructions.length; i++) {
  const [count, from, to] = instructions[i];
  const crates = (stacks[String(from - 1)] ?? []).splice(stacks[String(from - 1)].length - count, count);
  stacks[String(to - 1)] = (stacks[String(to - 1)] ?? []).concat(crates);
}

let answer = "";
for (let i = 0; i < stackCount; i++) {
  answer += stacks[i][stacks[i].length - 1];
}

console.log(answer);