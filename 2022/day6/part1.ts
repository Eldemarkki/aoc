import { readLines } from "../../utils/input";
const lines = readLines() as string[];

const str = lines[0].split("")

const s = str.findIndex((c, i) => {
  const nums = str.slice(i, i + 4).map(l => l.charCodeAt(0)).sort();
  return nums.every((n, i) => n != nums[(i + 1) % 4]);
})

console.log(s + 4)