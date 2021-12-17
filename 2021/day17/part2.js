const { readLines } = require("../../utils/input")

const xxyy = readLines()[0].slice(15).split(", y=")
const xs = xxyy[0].split("..").map(Number)
const ys = xxyy[1].split("..").map(Number)
const area = [[xs[0], ys[0]], [xs[1], ys[1]]]

const simulate = (initialVelocity, steps) => {
  let point = [0, 0]
  let velocity = initialVelocity;
  const points = [point]
  for (let i = 0; i < steps; i++) {
    let newPoint = [...point]
    newPoint[0] += velocity[0]
    newPoint[1] += velocity[1]

    velocity[0] = Math.max(velocity[0] - 1, 0)
    velocity[1] = velocity[1] - 1, 0
    points.push(newPoint)
    point = newPoint
  }
  return points
}

const isInArea = p => {
  return area[0][0] <= p[0] && p[0] <= area[1][0] &&
    area[0][1] <= p[1] && p[1] <= area[1][1]
}

const size = 300
let c = 0;
for (let y = -size; y <= size; y++) {
  for (let x = 0; x <= size; x++) {
    const points = simulate([x, y], size * 10)
    if (points.some(isInArea)) {
      c++;
    }
  }
}
console.log(c)
