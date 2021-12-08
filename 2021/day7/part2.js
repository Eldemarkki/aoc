const { readLines } = require("../../utils/input");

const data = readLines()[0].split(",").map(Number);

const fuels = new Array(data.length).fill(0);

const calcFuel = (a, b) => {
  const loopCount = Math.abs(a - b);
  const fuel = loopCount * (loopCount + 1) / 2;
  return fuel;
}

for (let i = 0; i < data.length; i++) {
  let fuel = 0;
  const pos = i;
  for (let j = 0; j < data.length; j++) {
    const pos2 = data[j];
    fuel += calcFuel(pos, pos2)
  }
  fuels[i] = fuel;
}

const minFuel = Math.min.apply(Math, fuels);
console.log(minFuel)