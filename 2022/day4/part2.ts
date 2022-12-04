import { readLines } from "../../utils/input";
const lines = readLines() as string[];

let answer = 0

for (const line of lines) {
  const [first, second] = line.split(",");
  const [firstMin, firstMax] = first.split("-").map(Number);
  const [secondMin, secondMax] = second.split("-").map(Number);

  if ((firstMin <= secondMin && secondMin <= firstMax) ||
    (firstMin <= secondMax && secondMax <= firstMax) ||
    (secondMin <= firstMin && firstMin <= secondMax) ||
    (secondMin <= firstMax && firstMax <= secondMax)) {
    answer++;
  }
}

console.log(answer);