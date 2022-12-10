import { readLines } from "../../utils/input";
const lines = readLines() as string[];

let cycle = 0;
let x = 1;

let crt: string[] = [];

const increaseCycle = () => {
  let pos = x % 40;
  const isVisible = cycle % 40 - 1 <= pos && pos <= cycle % 40 + 1;
  crt.push(isVisible ? "#" : ".");
  cycle += 1;
}

for (const line of lines) {
  const parts = line.split(" ");
  const command = parts[0];

  if (command === "noop") {
    increaseCycle();
  }
  else if (command === "addx") {
    increaseCycle();
    increaseCycle();
    x += parseInt(parts[1]);
  }
}

for (let i = 0; i < 6; i++) {
  console.log(crt.slice(i * 40, i * 40 + 40).join(""));
}