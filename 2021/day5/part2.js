const { readLines } = require("../../utils/input");

const lines = readLines().map(line => {
  const points = line.trim().split(" -> ");
  return points.map(point => point.split(",").map(Number));
})

const isHorizontalOrVertical = (line) => {
  const xsame = line[0][0] === line[1][0];
  const ysame = line[0][1] === line[1][1]
  return xsame || ysame;
}

// Maps value `val` from range [inputMin, inputMax] to [outputMin, outputMax]
const mapRange = (val, inputMin, inputMax, outputMin, outputMax) => ((val - inputMin) / (inputMax - inputMin) * (outputMax - outputMin) + outputMin) || 0

const map = {}

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const p1 = line[0];
  const p2 = line[1];

  const isDiagonal = !isHorizontalOrVertical(line);

  if (isDiagonal) {
    const smaller = p1[0] < p2[0] ? p1 : p2;
    const bigger = p1[0] < p2[0] ? p2 : p1;

    for (let t = smaller[0]; t <= bigger[0]; t++) {
      const point = [t, Math.round(mapRange(t, smaller[0], bigger[0], smaller[1], bigger[1]))]
      map[point] = (map[point] || 0) + 1
    }
  }
  else {
    const changingComponent = p1[0] == p2[0] ? 1 : 0
    const smaller = Math.min(p1[changingComponent], p2[changingComponent])
    const bigger = Math.max(p1[changingComponent], p2[changingComponent])
    for (let t = smaller; t <= bigger; t++) {
      const point = [0, 0];
      point[changingComponent] = t;
      point[1 - changingComponent] = p1[1 - changingComponent];

      map[point] = (map[point] || 0) + 1
    }
  }
}

let count = 0;
for (const key in map) {
  const value = map[key];
  if (value >= 2) count++;
}

console.log(count);