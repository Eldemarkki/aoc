const { readNumberList } = require("../../utils/input");

const data = readNumberList();

let count = 0;
const windowSize = 3;
for (let i = 0; i < data.length; i++) {
  if (data[i + windowSize] - data[i] > 0) count++;
}

console.log("Count: " + count);