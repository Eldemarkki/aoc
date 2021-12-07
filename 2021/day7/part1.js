const { readLines } = require("../../utils/input");

const data = readLines()[0].split(",").map(Number);

const fuels = data.map(d => 0);

const calcFuel = (a, b) => {
  return Math.abs(a - b)
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