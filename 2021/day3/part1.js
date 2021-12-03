const { readLines } = require("../../utils/input");

const data = readLines("input.txt", 2);

let counts = {}
for (let i = 0; i < data.length; i++) {
  const line = data[i];
  for (let index = 0; index < line.length; index++) {
    const element = line[index];
    counts[index] = counts[index] || 0;
    counts[index] += element == "1" ? 1 : 0    
  }
}

let gamma = "";
let epsilon = "";
for (key of Object.keys(counts)){
  const val = counts[key];
  if(val <= data.length/2) {
    gamma += "1"
    epsilon += "0"
  }
  else{
    gamma += "0"
    epsilon += "1"
  }
}

console.log(parseInt(gamma, 2) * parseInt(epsilon, 2));