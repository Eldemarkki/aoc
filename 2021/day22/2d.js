const { readLines } = require("../../utils/input");

const lines = readLines("input.txt")

const areas = lines.map(line => {
  const s = line.split(" ")
  const components = s[1].split(",").map(component => component.slice(2).split("..").map(Number))
  return {
    active: s[0] === "on",
    start: [components[0][0], components[1][0], components[2][0]],
    end: [components[0][1] + 1, components[1][1] + 1, components[2][1] + 1],
  }
})

const xSorted = areas.map(a => [a.start[0], a.end[0]]).flat().filter((t = {}, a => !(t[a] = a in t))).sort((a, b) => a - b)
const ySorted = areas.map(a => [a.start[1], a.end[1]]).flat().filter((t = {}, a => !(t[a] = a in t))).sort((a, b) => a - b)
const zSorted = areas.map(a => [a.start[2], a.end[2]]).flat().filter((t = {}, a => !(t[a] = a in t))).sort((a, b) => a - b)

const intersect = (start1, end1, start2, end2) => {
  return start1 <= start2 && end2 <= end1;
}

const intersectRegion = (a, b) => {
  const x = intersect(a.start[0], a.end[0], b.start[0], b.end[0])
  const y = intersect(a.start[1], a.end[1], b.start[1], b.end[1])
  const z = intersect(a.start[2], a.end[2], b.start[2], b.end[2])
  return x && y && z
}

const calculateVolume = (start, end) => {
  const vol =
    (Math.abs(end[0] - start[0])) *
    (Math.abs(end[1] - start[1])) *
    (Math.abs(end[2] - start[2]))
  return vol;
}

let result = 0;
const loopCount = xSorted.length
let i = 0;
xSorted.forEach((x, xi) => {
  ySorted.forEach((y, yi) => {
    zSorted.forEach((z, zi) => {
      const start = [x, y, z];
      const endX = xSorted[xi + 1] !== undefined ? xSorted[xi + 1] : x
      const endY = ySorted[yi + 1] !== undefined ? ySorted[yi + 1] : y
      const endZ = zSorted[zi + 1] !== undefined ? zSorted[zi + 1] : z
      const end = [endX, endY, endZ];

      const vol = calculateVolume(start, end)

      let usedSpot = undefined;
      areas.forEach(area => {
        const intersects = intersectRegion(area, { start, end })
        if (intersects) {
          usedSpot = area.active
        }
      })

      if (usedSpot === true) {
        result += vol
      }

    })
  })
  console.log(`${i}/${loopCount}`)
  i += 1
})

console.log(result)
