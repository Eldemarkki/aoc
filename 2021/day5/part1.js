const { readLines } = require("../../utils/input");

const data = readLines().map(line => {
  const points = line.trim().split(" -> ");
  return points.map(point => point.split(",").map(Number));
})

// These are the horizontal and vertical lines only
const lines = data.filter(line => {
  const xsame = line[0][0] === line[1][0];
  const ysame = line[0][1] === line[1][1]
  return xsame || ysame;
})

const map = {}

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const p1 = line[0];
  const p2 = line[1];

  // Determine which component (x or y) is changing in this line
  const changingComponent = p1[0] == p2[0] ? 1 : 0

  // Get the smaller and bigger values of the changing component
  const smaller = Math.min(p1[changingComponent], p2[changingComponent])
  const bigger = Math.max(p1[changingComponent], p2[changingComponent])

  // The non-changing component's value
  const constantValue = p1[1 - changingComponent];

  // Loop through all points on the line
  for (let t = smaller; t <= bigger; t++) {
    const point = [0, 0];
    point[changingComponent] = t;
    point[1 - changingComponent] = constantValue;

    map[point] = (map[point] || 0) + 1
  }
}

let count = 0;
for (const key in map) {
  const value = map[key];
  if (value >= 2) count++;
}

console.log(count);