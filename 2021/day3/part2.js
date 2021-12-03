const { readLines } = require("../../utils/input");

const data = readLines("input.txt", 2);

const calculateCounts = (d) => {
  // Key is the index of the bit, value is how many 1-bits were at that index
  let counts = {}

  for (let i = 0; i < d.length; i++) {
    const line = d[i];
    for (let index = 0; index < line.length; index++) {
      const element = line[index];
      counts[index] = counts[index] || 0; // Initialize to 0 if uninitialized
      counts[index] += element == "1" ? 1 : 0
    }
  }
  return counts;
}

const calculateRating = (data, useMostCommon) => {
  let dataCopy = [...data]
  for (let i = 0; i < data[0].length; i++) {
    let counts = calculateCounts(dataCopy)
    const zero = useMostCommon ? "0" : "1";
    const one = useMostCommon ? "1" : "0";
    const mostCommon = counts[i] < dataCopy.length / 2 ? zero : one;
    dataCopy = dataCopy.filter(line => line[i] == mostCommon)
    if (dataCopy.length == 1) {
      return parseInt(dataCopy[0], 2)
    }
  }
  return -1;
}

const oxygenRating = calculateRating(data, true)
const co2Rating = calculateRating(data, false)

console.log(oxygenRating * co2Rating)