import { readLines } from "../../utils/input";
const lines = readLines() as string[];

const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

const getPriority = (char: string) => {
  return alphabet.indexOf(char) + 1;
}

const getCommonChars = (a: string, b: string, c: string) => {
  const commonChars: string[] = [];
  for (const char of a) {
    if (b.includes(char) && c.includes(char) && !commonChars.includes(char)) {
      commonChars.push(char);
    }
  }
  for (const char of b) {
    if (a.includes(char) && c.includes(char) && !commonChars.includes(char)) {
      commonChars.push(char);
    }
  }
  for (const char of c) {
    if (a.includes(char) && b.includes(char) && !commonChars.includes(char)) {
      commonChars.push(char);
    }
  }
  return commonChars;
}

const groups: string[][] = [];
for (let i = 0; i < lines.length; i += 3) {
  groups.push([lines[i], lines[i + 1], lines[i + 2]]);
}

let answer = 0;

for (const group of groups) {
  const first = group[0];
  const second = group[1];
  const third = group[2];

  const common = getCommonChars(first, second, third);
  answer += getPriority(common[0]);
}

console.log(answer)