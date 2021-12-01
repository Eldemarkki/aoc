const { readNumberList } = require("../../utils/input");

const data = readNumberList();

let count = 0;
const windowSize = 3;
for (let i = 0; i < data.length; i++) {
  let firstSum = 0;
  for (let windowIndex = 0; windowIndex < windowSize; windowIndex++) {
    firstSum += data[i + windowIndex];
  }

  let secondSum = firstSum - data[i] + data[i + windowSize];
  if (secondSum > firstSum) count++;
}

console.log("Count: " + count);