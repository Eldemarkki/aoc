const { readLines } = require("../../utils/input");

// Take the letters which are in either `a` or `b`, but not in both.
// This can be used for example to "remove" parts of a digit.
const excludeOverlap = (a, b) => {
  let cs = "";
  Array.from(a).forEach(letter => {
    if (String(b).indexOf(letter) === -1) {
      cs += letter
    }
  })

  Array.from(b).forEach(letter => {
    if (String(a).indexOf(letter) === -1 && cs.indexOf(letter) === -1) {
      cs += letter
    }
  })

  return cs;
}

// This basically just removes duplicate characters
const combine = (x) => {
  let result = "";
  for (const el of Array.from(x)) {
    if (result.indexOf(el) === -1) result += el
  }
  return result;
}

// Compare if two arrays are equal
const arrayEquals = (a, b) => a.length === b.length && JSON.stringify(a) === JSON.stringify(b);

const solvePatterns = line => {
  const data = line;

  /*
  lineX means a single line at index X
  lineXY means a pair of lines at indices X and Y
  
  The line indices go as follows:
     0000
    1    2
    1    2
     3333
    4    5
    4    5
     6666
  */

  // Sort the data by increasing length
  const dataDigits = data.split(" ").sort((a, b) => a.length - b.length)

  const onePattern = dataDigits[0]; // digit 1 is always the first
  const sevenPattern = dataDigits[1]; // digit 7 is always the second
  const fourPattern = dataDigits[2]; // digit 4 is always the third
  const eightPattern = dataDigits[9]; // digit 8 is always the last

  // Get line 0 by 
  const line0 = excludeOverlap(onePattern, sevenPattern)
  const line13 = excludeOverlap(fourPattern, onePattern)

  // digit 5 is the one that has 5 lines, and it doesn't use lines 0, 1, and 3
  const fivePattern = dataDigits.filter(d => d.length === 5 && d.indexOf(line0) !== -1 && d.indexOf(line13[0]) !== -1 && d.indexOf(line13[1]) !== -1)[0];

  // You can get the digit 9 by combining digits 5 and 1
  const ninePattern = combine(fivePattern + onePattern)

  const line2 = excludeOverlap(fivePattern, ninePattern);

  const sixPattern = excludeOverlap(eightPattern, line2);

  // Solve 0 digit, it's the only one left with 6 lines
  const zeroPattern = dataDigits.filter(d => {
    if (d.length !== 6) return false;
    const sorted = Array.from(d).sort();
    if (arrayEquals(sorted, Array.from(sixPattern).sort())) return false;
    if (arrayEquals(sorted, Array.from(ninePattern).sort())) return false;
    return true;
  })[0]

  // const line1 = excludeOverlap(line13, line3);

  const line3 = excludeOverlap(zeroPattern, eightPattern);
  const line5 = excludeOverlap(line0 + line2, sevenPattern);
  const line56 = excludeOverlap(fivePattern, line13 + line0);
  const line4 = excludeOverlap(sixPattern, fivePattern)
  const line6 = excludeOverlap(line5, line56);

  const twoPattern = combine(line0 + line2 + line3 + line4 + line6);
  const threePattern = combine(excludeOverlap(twoPattern, line4) + line5)

  return [
    zeroPattern, onePattern, twoPattern, threePattern, fourPattern, fivePattern, sixPattern, sevenPattern, eightPattern, ninePattern
  ].map(pattern => String(Array.from(pattern).sort()))
}

const solve = line => {
  const [data, wanted] = line.split(" | ");
  const patterns = solvePatterns(data);
  const sortedWanted = wanted.split(" ").map(v => String(Array.from(v).sort()));

  let num = "";

  for (let i = 0; i < sortedWanted.length; i++) {
    const want = sortedWanted[i];
    for (let patternIndex = 0; patternIndex < patterns.length; patternIndex++) {
      const pattern = patterns[patternIndex];
      if (want === pattern) {
        num += String(patternIndex);
      }
    }
  }

  return Number(num);
}

const lines = readLines("input.txt").map(line => line.trim());

const sum = lines.reduce((prev, curr) => prev + solve(curr), 0)

console.log(sum)
