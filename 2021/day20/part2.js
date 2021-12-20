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

const gridSize = 600
const grid = new Array(gridSize).fill()
for (let i = 0; i < gridSize; i++) {
  grid[i] = new Array(gridSize)
}

for (let rowIndex = 0; rowIndex < imageLines.length; rowIndex++) {
  const row = imageLines[rowIndex];
  for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
    const letter = row[columnIndex];
    grid[rowIndex + gridSize / 2 - 50][columnIndex + gridSize / 2 - 50] = letter
  }
}

const areSamePoint = (a, b) => a[0] === b[0] && a[1] === b[1]

const addPoints = (a, b) => ([a[0] + b[0], a[1] + b[1]])

const arrayIncludes = (array, element) => array.some(v => areSamePoint(v, element))


const applyAlgorithm = (grid) => {
  const newImage = new Array(gridSize).fill()
  for (let i = 0; i < gridSize; i++) {
    newImage[i] = new Array(gridSize)
  }

  for (let x = 1; x < gridSize - 1; x++) {
    for (let y = 1; y < gridSize - 1; y++) {
      const p = [x, y]
      const collectedPoints = offsets.map(offset => {
        const newPoint = addPoints(p, offset)
        return grid[newPoint[1]][newPoint[0]] === "#" ? 1 : 0
      })
      const lookupIndex = parseInt(collectedPoints.join(""), 2)
      const newPixel = algorithm[lookupIndex]
      newImage[y][x] = newPixel
    }
  }
  return newImage
}

const gridToFile = grid => {
  let content = ""
  for (let i = 0; i < grid.length; i++) {
    content += grid[i].join("") + "\n"
  }
  require("fs").writeFileSync("outputgrid.txt", Buffer.from(content))
}

let image = [...grid]
for (let i = 0; i < 50; i++) {
  image = applyAlgorithm(image)
}

gridToFile(image)
console.log("Finding the answer: I manually extracted the \"inner\" part of the image in outputgrid.txt, and counted the # characters in it")
