const { readLines } = require("../../utils/input");

const lines = readLines("input.txt");

const data = lines.map((line, rowIndex) => Array.from(line).map((p, columnIndex) => ({ value: Number(p), position: [rowIndex, columnIndex] })))
const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]]

const manhattanDistance = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1])

const getData = point => data[point[1]][point[0]]

const areSamePoint = (a, b) => a[0] === b[0] && a[1] === b[1]

const indexOf = (array, value) => {
  for (let i = 0; i < array.length; i++) {
    const element = array[i];
    if (areSamePoint(value, element)) {
      return i
    }
  }
  return -1
}

const calculatePrev = (graph, source, calculateLength) => {
  let q = []
  const dist = {}
  const prev = {}
  for (const v of graph) {
    dist[v] = Infinity
    prev[v] = undefined
    q.push(v)
  }
  dist[undefined] = Infinity
  dist[source] = 0

  while (q.length !== 0) {
    let u = undefined;
    let uIndex = -1;
    for (let qi = 0; qi < q.length; qi++) {
      const element = q[qi];
      if (dist[element] < dist[u]) {
        u = element
        uIndex = qi;
      }
    }
    q.splice(uIndex, 1);
    directions.forEach(dir => {
      const v = [u[0] + dir[0], u[1] + dir[1]]
      const vi = indexOf(q, v);
      if (vi !== -1) {
        const alt = dist[u] + calculateLength(v)
        if (alt < dist[v]) {
          dist[v] = alt
          prev[v] = u
        }
      }
    })
    console.log(q.length)
  }

  return prev;
}

const getPath = (prevMap, source, target) => {
  const s = []
  let u = target
  const uIsSource = (u[0] === source[0] && u[1] === source[1]);
  if (prevMap[u] || uIsSource) {
    while (u) {
      s.push(u);
      u = prevMap[u]
    }
  }

  return s.reverse();
}

const getRiskInTile = (risk, tileX, tileY) => {
  const d = manhattanDistance([0, 0], [tileX, tileY]);
  const newRisk = risk + d
  if (newRisk <= 9) return newRisk;
  return newRisk % 9
}

const tileCount = 5
const fullmap = [];
for (let tileY = 0; tileY < tileCount; tileY++) {
  fullmap.push(...data.map((line, rowIndex) => {
    const newLine = []
    for (let tileX = 0; tileX < tileCount; tileX++) {
      newLine.push(...line.map((v, columnIndex) => {
        const risk = getRiskInTile(v.value, tileX, tileY)
        const x = tileX * data[0].length + columnIndex
        const y = tileY * data.length + rowIndex
        return {
          value: risk,
          position: [x, y]
        }
      }))
    }
    return newLine
  }))
}

const globalPointInFirstTile = point => ([point[0] % data[0].length, point[1] % data.length])

console.time("part2")
const prev = calculatePrev(fullmap.flat().map(d => d.position), [0, 0], point => {
  const tileX = Math.floor(point[0] / data[0].length)
  const tileY = Math.floor(point[1] / data.length)
  const riskInFirstTile = getData([point[0] % data[0].length, point[1] % data.length]).value
  return getRiskInTile(riskInFirstTile, tileX, tileY)
});
console.timeEnd("part2")

const targetPos = [data[0].length * tileCount - 1, data.length * tileCount - 1]
const path = getPath(prev, [0, 0], targetPos)

let totalRisk = path.slice(1).reduce((prev, point) => {
  const tilePos = [Math.floor(point[0] / data[0].length), Math.floor(point[1] / data.length)]
  return prev + getRiskInTile(getData(globalPointInFirstTile(point)).value, tilePos[0], tilePos[1])
}, 0)

console.log("Total", totalRisk)
