import { readLines } from "../../utils/input";

const lines = readLines("input.txt");

const time = Number(lines[0].split(/\s+/).slice(1).join(""));
const dist = Number(lines[1].split(/\s+/).slice(1).join(""));

let minTimeToRelease = 0;
while (true) {
  const d = (time - minTimeToRelease) * minTimeToRelease;
  if (d >= dist) {
    break;
  }
  minTimeToRelease++;
}

console.log(time - minTimeToRelease * 2 + 1);
