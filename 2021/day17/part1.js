const { readLines } = require("../../utils/input")

const sumToN = n => n * (n + 1) / 2

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

const findVelX = () => {
  const minVelX = Math.ceil((Math.sqrt(4 * 2 * area[0][0] + 1) - 1) / 2)
  const maxVelX = Math.floor((Math.sqrt(4 * 2 * area[1][0] + 1) - 1) / 2)
  return [minVelX, maxVelX]
}

const [minVelX, maxVelX] = findVelX();

const isInArea = p => {
  return area[0][0] <= p[0] && p[0] <= area[1][0] &&
    area[0][1] <= p[1] && p[1] <= area[1][1]
}

let best = -100
for (let y = -1000; y < 10000; y++) {
  for (let x = minVelX; x < maxVelX; x++) {
    const points = simulate([x, y], 1000)
    if (points.some(isInArea)) {
      if (y > best) best = y;
    }
  }
}

console.log(sumToN(best))
