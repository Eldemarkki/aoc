const { readNumberList } = require("../../utils/input");

const data = readNumberList();

let count = 0;
for (let i = 1; i < data.length; i++) {
  if (data[i - 1] < data[i]) count++;
}

console.log("Count: " + count);