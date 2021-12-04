const { readLines } = require("../../utils/input");

const data = readLines("input.txt", 2);

const calculateRating = (data, useMostCommon) => {
  let dataCopy = [...data]
  for (let i = 0; i < data[0].length; i++) {
    const count = dataCopy.reduce((prev, curr) => prev + parseInt(curr[i]), 0)
    const mostCommon = count < dataCopy.length / 2 ? 1 - useMostCommon : useMostCommon;
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