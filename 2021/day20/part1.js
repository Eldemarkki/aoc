const { readLines } = require("../../utils/input");

const lines = readLines("input.txt")

const offsets = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [0, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
]

const algorithm = lines[0]
const imageLines = lines.slice(2)

const lightPixels = []
for (let rowIndex = 0; rowIndex < imageLines.length; rowIndex++) {
  const row = imageLines[rowIndex];
  for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
    const letter = row[columnIndex];
    if (letter === "#") {
      lightPixels.push([columnIndex, rowIndex])
    }
  }
}

const areSamePoint = (a, b) => a[0] === b[0] && a[1] === b[1]

const addPoints = (a, b) => ([a[0] + b[0], a[1] + b[1]])

const arrayIncludes = (array, element) => array.some(v => areSamePoint(v, element))

const buffer = 2 + 10
const applyAlgorithm = (lightPixels, nthRound) => {
  const newImage = []
  const xs = lightPixels.map(p => p[0])
  const ys = lightPixels.map(p => p[1])
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)

  for (let x = minX - buffer; x <= maxX + buffer; x++) {
    for (let y = minY - buffer; y <= maxY + buffer; y++) {
      const p = [x, y]
      const collectedPoints = offsets.map(offset => {
        return arrayIncludes(lightPixels, addPoints(p, offset)) ? 1 : 0
      })
      const lookupIndex = parseInt(collectedPoints.join(""), 2)
      const newPixel = algorithm[lookupIndex]
      if (newPixel === "#") newImage.push(p)
    }
  }
  return newImage
}

const printImage = lightPixels => {
  const xs = lightPixels.map(p => p[0])
  const ys = lightPixels.map(p => p[1])
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)

  for (let y = minY; y <= maxY; y++) {
    let line = ""
    for (let x = minX; x <= maxX; x++) {
      if (arrayIncludes(lightPixels, [x, y])) {
        line += "#"
      }
      else {
        line += "."
      }
    }
    console.log(line)
  }
}

let image = [...lightPixels]
printImage(image)
console.log()
for (let i = 0; i < 50; i++) {
  image = applyAlgorithm(image)
  printImage(image)
  console.log()

}

console.log("Finding the answer: I manually extracted the \"inner\" part of the last printed image, and counted the # characters in it")
