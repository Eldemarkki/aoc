const { readLines } = require("../../utils/input");

const data = readLines();
let depth = 0;
let x = 0;

for (let i = 0; i < data.length; i++) {
  const dir = data[i].split(" ")[0];
  const num = parseInt(data[i].split(" ")[1]);
  if(dir == "forward") x += num;
  if(dir == "down") depth += num;
  if(dir == "up") depth -= num;
}

console.log(depth * x);