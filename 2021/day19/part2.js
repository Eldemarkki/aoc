const { readLines } = require("../../utils/input");

const scanners = []
let currentScanner = []
readLines("input.txt").forEach(line => {
  if (line.trim().length !== 0) {
    if (line.startsWith("---")) {
      if (currentScanner.length !== 0) {
        scanners.push([...currentScanner])
        currentScanner = []
      }
    }
    else {
      currentScanner.push(line.split(",").map(Number))
    }
  }
})
scanners.push([...currentScanner])

const areSamePoint = (a, b) => a[0] === b[0] && a[1] === b[1] && a[2] === b[2]

const subtractPoints = (a, b) => ([a[0] - b[0], a[1] - b[1], a[2] - b[2]])
const addPoints = (a, b) => ([a[0] + b[0], a[1] + b[1], a[2] + b[2]])

const arrayIncludes = (array, element) => array.some(v => areSamePoint(v, element))

const calculateRotations = point => {
  return [
    [point[0], point[1], point[2]],
    [-point[2], point[1], point[0]],
    [-point[0], point[1], -point[2]],
    [point[2], point[1], -point[0]],

    [-point[0], -point[1], point[2]],
    [-point[2], -point[1], -point[0]],
    [point[0], -point[1], -point[2]],
    [point[2], -point[1], point[0]],


    [point[1], point[2], point[0]],
    [-point[0], point[2], point[1]],
    [-point[1], point[2], -point[0]],
    [point[0], point[2], -point[1]],

    [-point[1], -point[2], point[0]],
    [-point[0], -point[2], -point[1]],
    [point[1], -point[2], -point[0]],
    [point[0], -point[2], point[1]],


    [point[2], point[0], point[1]],
    [-point[1], point[0], point[2]],
    [-point[2], point[0], -point[1]],
    [point[1], point[0], -point[2]],

    [-point[2], -point[0], point[1]],
    [-point[1], -point[0], -point[2]],
    [point[2], -point[0], -point[1]],
    [point[1], -point[0], point[2]]
  ]
}

const manhattanDistance = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2])

const generateOverlapsSingle = (a, b) => {
  const overlaps = {}
  a.forEach(ref => {
    for (let bIndex = 0; bIndex < b.length; bIndex++) {
      const thisIsRef = b[bIndex];
      const offset = subtractPoints(ref, thisIsRef)
      const count = b.reduce((prev, curr) => {
        const newPoint = addPoints(curr, offset)
        if (arrayIncludes(a, newPoint)) {
          return prev + 1
        }
        return prev;
      }, 0)
      overlaps[offset] = count
    }
  })
  return overlaps
}

const generateOrientationsForPoints = points => {
  const orientationCount = 24
  const orientedPoints = new Array(orientationCount).fill()
  for (let i = 0; i < orientationCount; i++) {
    const orientation = new Array(points.length).fill();
    for (let j = 0; j < points.length; j++) {
      const element = points[j];
      orientation[j] = calculateRotations(element)[i]
    }
    orientedPoints[i] = orientation
  }
  return orientedPoints
}

const generateOrientedOverlaps = (a, b) => {
  const orientationOverlaps = {}

  const bOriented = generateOrientationsForPoints(b)
  for (let i = 0; i < bOriented.length; i++) {
    orientationOverlaps[i] = generateOverlapsSingle(a, bOriented[i])
  }

  return orientationOverlaps
}

// Magic from StackOverflow https://stackoverflow.com/a/53521892/8715999
const removeDuplicates = array => array.filter((t = {}, a => !(t[a] = a in t)));;

let scannersLeft = scanners.slice(1)
let existingBeacons = [...scanners[0]]
const scannerPositions = [[0, 0, 0]]

const calculatePosition = (beacons, scanner) => {
  const overlaps = generateOrientedOverlaps(beacons, scanner)
  const filtered = Object.keys(overlaps).filter(key => Object.values(overlaps[key]).some(value => value >= 12)).map(key => ({ key, value: overlaps[key] }))
  if (filtered.length === 0) return undefined;

  const offsets = filtered[0].value;
  const orientation = Number(filtered[0].key)
  const offsetKeys = Object.keys(offsets).filter(key => offsets[key] >= 12);

  const scannerPosition = offsetKeys[0].split(",").map(Number)
  return { scannerPosition, orientation }
}

while (scannersLeft.length !== 0) {
  console.log("Scanners left", scannersLeft.length)
  for (let i = 0; i < scannersLeft.length; i++) {
    const scanner = scannersLeft[i];
    const s = calculatePosition(existingBeacons, scanner)
    if (!s) continue

    scannerPositions.push(s.scannerPosition)

    const orienationPoints = generateOrientationsForPoints(scanner);
    const scannerPointsGlobal = orienationPoints[s.orientation].map(p => addPoints(p, s.scannerPosition))
    existingBeacons = removeDuplicates(existingBeacons.concat(scannerPointsGlobal))
    scannersLeft = scannersLeft.filter((_, index) => index !== i)
  }
}

const distances = []
for (let i = 0; i < scannerPositions.length; i++) {
  for (let j = 0; j < scannerPositions.length; j++) {
    if (i === j) continue;
    distances.push(manhattanDistance(scannerPositions[i], scannerPositions[j]))
  }
}
console.log("Max distance", Math.max(...distances))