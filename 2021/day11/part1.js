const { readLines } = require("../../utils/input");

const data = readLines().map(line => Array.from(line).map(Number))

const flashPoint = (state, map, x, y) => {
  const copy = [...state];
  for (let _x = -1; _x <= 1; _x++) {
    for (let _y = -1; _y <= 1; _y++) {
      const newX = x + _x;
      const newY = y + _y;
      if (newX < 0 || newX >= copy[0].length || newY < 0 || newY >= copy.length) continue;
      if (!map[[newX, newY]]) {
        copy[newY][newX]++;
      }
    }
  }
  copy[y][x] = 0;
  return copy;
}

const simulate = state => {
  let copy = [...state];
  copy = copy.map(line => line.map(value => value + 1))
  let shouldFlash = []
  for (let y = 0; y < copy.length; y++) {
    const line = copy[y];
    for (let x = 0; x < line.length; x++) {
      const value = line[x];
      if (value > 9) {
        shouldFlash.push([x, y])
      }
    }
  }

  // Do the flashing
  const haveFlashed = shouldFlash.reduce((prev, curr) => ({ ...prev, [curr]: true }), {})
  let flashes = 0;
  while (shouldFlash.length !== 0) {
    const [point, ...rest] = shouldFlash;
    shouldFlash = rest;
    copy = flashPoint(copy, haveFlashed, point[0], point[1])
    haveFlashed[point] = true
    flashes++;
    for (let _x = -1; _x <= 1; _x++) {
      for (let _y = -1; _y <= 1; _y++) {
        const newX = point[0] + _x
        const newY = point[1] + _y;
        if (newX < 0 || newX >= copy[0].length || newY < 0 || newY >= copy.length) continue;
        if (copy[newY][newX] > 9 && !haveFlashed[[newX, newY]]) {
          shouldFlash.push([newX, newY])
          haveFlashed[[newX, newY]] = true
        }
      }
    }
  }

  return { newState: copy, flashes };
}

let flashCount = 0;
let state = data
for (let i = 0; i < 100; i++) {
  const { newState, flashes } = simulate(state);
  state = newState;
  flashCount += flashes
}

console.log(flashCount);