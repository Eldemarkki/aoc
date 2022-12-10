import { readLines } from "../../utils/input";
const lines = readLines() as string[];

let cycle = 0;
let x = 1;

let xPrimed = 1;

let strengths: number[] = [];

const increaseCycle = () => {
  cycle += 1;

  if ((cycle + 20) % 40 === 0) {
    const signalStrength = cycle * x;
    console.log(`Cycle ${cycle} * ${x}: Signal strength is ${signalStrength}`);
    strengths.push(signalStrength);
  }
}

for (const line of lines) {
  const parts = line.split(" ");
  const command = parts[0];

  if (command === "noop") {
    increaseCycle();
  }
  else if (command === "addx") {
    xPrimed = 1;
    increaseCycle();
    increaseCycle();
    x += parseInt(parts[1]);
  }
}

console.log(strengths.reduce((a, b) => a + b, 0));