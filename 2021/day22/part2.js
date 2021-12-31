const { readLines } = require("../../utils/input");

const lines = readLines("mock.txt")

const areas = lines.map(line => {
  const s = line.split(" ")
  const components = s[1].split(",").map(component => component.slice(2).split("..").map(Number))
  return {
    active: s[0] === "on",
    start: [components[0][0], components[1][0], components[2][0]],
    end: [components[0][1], components[1][1], components[2][1]],
  }
})

const xSorted = areas.map(a => [a.start[0], a.end[0]]).flat().filter((t = {}, a => !(t[a] = a in t))).sort((a, b) => a - b)
const ySorted = areas.map(a => [a.start[1], a.end[1]]).flat().filter((t = {}, a => !(t[a] = a in t))).sort((a, b) => a - b)
const zSorted = areas.map(a => [a.start[2], a.end[2]]).flat().filter((t = {}, a => !(t[a] = a in t))).sort((a, b) => a - b)

console.log(xSorted)
console.log(ySorted)
console.log(zSorted)
console.log("-----")

const intersect = (start1, end1, start2, end2) => {
  return start1 <= start2 && end2 <= end1;
  // return start1 < start2 + 0.5 && start2 + 0.5 < end1
  // const left = start1 <= end2
  // const right = start2 >= end1;
  // console.log(start1, end1, start2, end2, left, right)
  // return (left && right)
}

const intersectRegion = (a, b) => {
  const x = intersect(a.start[0], a.end[0], b.start[0], b.end[0])
  const y = intersect(a.start[1], a.end[1], b.start[1], b.end[1])
  const z = intersect(a.start[2], a.end[2], b.start[2], b.end[2])
  return x && y && z
}

const calculateVolume = (start, end) => {
  const vol =
    (Math.abs(end[0] - start[0]) + 1) *
    (Math.abs(end[1] - start[1]) + 1) *
    (Math.abs(end[2] - start[2]) + 1)
  return vol;
}

let result = 0;
xSorted.slice(0,-1).forEach((x, xi) => {
  ySorted.slice(0,-1).forEach((y, yi) => {
    zSorted.slice(0,-1).forEach((z, zi) => {
      const start = [x, y, z];
      const end = [xSorted[xi + 1], ySorted[yi + 1], zSorted[zi + 1]];
      // console.log(start, end)
      if(end.some(v => v === undefined)) return;
      
      const vol = calculateVolume(start, end)

      let usedSpot = undefined;
      let anyIntersects = false;
      const is = []
      areas.forEach(area => {
        const intersects = intersectRegion(area, { start, end })
        if (intersects) {
          usedSpot = area.active
          anyIntersects = true
          is.push(area)
        }
      })
      // console.log(usedSpot, anyIntersects)
      console.log(start, anyIntersects)
      // console.log(start, { start, end }, is)
      if (usedSpot === true) {
        // console.log("v", start, end, is)
        result += vol
      }
    })
  })
})

console.log("Result", result)
