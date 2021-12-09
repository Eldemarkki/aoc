const { readLines } = require("../../utils/input");

const data = readLines("input.txt").map(line => line.trim().split("").map(Number))
const height = data.length;
const width = data[0].length;

const offsets = [[1, 0], [0, -1], [-1, 0], [0, 1]]

const isOutside = (x, y) => x < 0 || x >= width || y < 0 || y >= height

const getPoint = (x, y) => {
  if (isOutside(x, y)) return 10000000000;
  return data[y][x]
}

let lowpoints = [];
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const isLowPoint = offsets.every(offset => {
      return getPoint(x, y) < getPoint(x + offset[0], y + offset[1]);
    })
    if (isLowPoint) {
      lowpoints.push([x, y])
    }
  }
}

const findBasinSize = point => {
  const visited = {};
  search = [point];

  let count = 0;
  while (search.length !== 0) {
    for (let i = 0; i < search.length; i++) {
      const element = search[i];
      visited[element] = true;
      count++;
      search = search.filter(v => JSON.stringify(v) !== JSON.stringify(element));
      offsets.forEach(offset => {
        const p = [element[0] + offset[0], element[1] + offset[1]]
        if (!isOutside(p[0], p[1]) && search.indexOf(p) === -1 && !visited[p] && getPoint(p[0], p[1]) !== 9) {
          search.push(p)
        }
      });
    }
  }
  
  return count
}

const basinSizesDescending = lowpoints.map(p => findBasinSize(p)).sort((a, b) => Number(b) - Number(a))
console.log(basinSizesDescending[0] * basinSizesDescending[1] * basinSizesDescending[2])