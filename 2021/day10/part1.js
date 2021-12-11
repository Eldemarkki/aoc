const { readLines } = require("../../utils/input");

const points = {
  ")": 3,
  "]": 57,
  "}": 1197,
  ">": 25137
}

const validate = line => {
  const chars = Array.from(line);
  let stack = [];

  for (let i = 0; i < chars.length; i++) {
    const element = line[i];
    if (element === "<" || element === "[" || element === "{" || element === "(") {
      stack.push(element)
    }
    else {
      const last = stack[stack.length - 1];
      if (element === ">" && last === "<") {
        stack = stack.slice(0, -1);
      }
      else if (element === "}" && last === "{") {
        stack = stack.slice(0, -1);
      }
      else if (element === "]" && last === "[") {
        stack = stack.slice(0, -1);
      }
      else if (element === ")" && last === "(") {
        stack = stack.slice(0, -1);
      }
      else {
        return element;
      }
    }
  }

  return true
}

const lines = readLines("input.txt").map(l => l.trim());

let sum = 0;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const result = validate(line)
  if (result !== true) {
    sum += points[result]
  }
}

console.log(sum)