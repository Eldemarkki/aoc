import { readLines } from "../../utils/input";
const lines = readLines() as string[];

const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

const getPriority = (char: string) => {
  return alphabet.indexOf(char) + 1;
}

const getCommonChars = (a: string, b: string) => {
  const commonChars: string[] = [];
  for (const char of a) {
    if (b.includes(char) && !commonChars.includes(char)) {
      commonChars.push(char);
    }
  }
  for (const char of b) {
    if (a.includes(char) && !commonChars.includes(char)) {
      commonChars.push(char);
    }
  }
  return commonChars;
}

let answer = 0;
for (const line of lines) {
  const first = line.substring(0, line.length / 2);
  const second = line.substring(line.length / 2);
  const common = getCommonChars(first, second);
  answer += common.reduce((acc, curr) => acc + getPriority(curr), 0);
}

console.log(answer)