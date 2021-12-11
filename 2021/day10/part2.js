const { readLines } = require("../../utils/input");

const isCorrupt = line => {
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
        return [true];
      }
    }
  }

  return [false, stack]
}

const getScoreForStack = stack => {
  let score = 0;
  for (let i = 0; i < stack.length; i++) {
    const element = stack[stack.length - i - 1];
    score *= 5;
    if (element === "[") {
      score += 2
    } else if (element === "{") {
      score += 3
    } else if (element === "<") {
      score += 4
    } else {
      score += 1
    }
  }
  return score;
}

const scores = readLines()
  .map(line => isCorrupt(line)) 
  .filter(x => x[0] === false) // Only get the incomplete lines
  .map(l => getScoreForStack(l[1]))

console.log(scores.sort((a, b) => Number(a) - Number(b))[24])