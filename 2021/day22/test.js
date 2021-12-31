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

console.log(areas)

const calculateVolume = (start, end) => {
  const vol =
    (Math.abs(end[0] - start[0])) *
    (Math.abs(end[1] - start[1])) *
    (Math.abs(end[2] - start[2]))
  return vol;
}

const totalArea = areas.reduce((prev, area) => {
  return prev + calculateVolume(area.start, area.end)
}, 0)


const getOverlappingArea = (a, b) => {
  const start = [
    Math.max(a.start[0], b.start[0])-1,
    Math.max(a.start[1], b.start[1])-1,
    Math.max(a.start[2], b.start[2])-1,
  ]
  const end = [
    Math.min(a.end[0], b.end[0]),
    Math.min(a.end[1], b.end[1]),
    Math.min(a.end[2], b.end[2]),
  ]

  return {
    start, end
  }
}

console.log(totalArea)

let overlappingArea = 0;
for (let i = 0; i < areas.length; i++) {
  for (let j = 0; j < areas.length; j++) {
    if (i === j) continue;
    const overlap = getOverlappingArea(areas[i], areas[j])
    overlappingArea += calculateVolume(overlap.start, overlap.end);
  }
}

console.log(overlappingArea)

console.log(totalArea - overlappingArea / 3)