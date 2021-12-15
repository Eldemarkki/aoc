const { readLines } = require("../../utils/input");

const lines = readLines("input.txt");

const data = lines.map((line, rowIndex) => Array.from(line).map((p, columnIndex) => ({ value: Number(p), position: [rowIndex, columnIndex] })))


const getDataOr = (point, or) => {
  if (point[0] < 0 || point[0] >= data[0].length || point[1] < 0 || point[1] >= data.length) return or;
  return data[point[1]][point[0]]
}


const calcLength = (a, b) => {
  return getDataOr(b, 0).value
};

const indexOf = (array, value) => {
  for (let i = 0; i < array.length; i++) {
    const element = array[i];
    if (value[0] === element[0] && value[1] === element[1]) {
      return i
    }
  }
  return -1
}


const arrayIncludes = (array, value) => {
  return indexOf(array, value) !== -1
}

const areNeighbors = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) === 1

const solve = (graph, source) => {

  let q = []
  const dist = {}
  const prev = {}
  for (const v of graph) {
    dist[v] = Infinity
    prev[v] = undefined
    q.push(v)
  }

  dist[source] = 0

  while (q.length !== 0) {
    const u = q.sort((a, b) => dist[a] - dist[b])[0]
    q = q.filter(o => JSON.stringify(o) !== JSON.stringify(u))
    q.forEach(v => {
      if (areNeighbors(u, v)) {
        const alt = dist[u] + calcLength(u, v)
        if (alt < dist[v]) {
          dist[v] = alt
          prev[v] = u
        }
      }
    });
  }

  const s = []
  let u = [data[0].length - 1, data.length - 1]
  const uIsSource = (u[0] === source[0] && u[1] === source[1]);

  if (prev[u] || uIsSource) {
    while (u) {
      s.push(u);
      u = prev[u]
    }
  }

  return s.reverse();
}

const path = solve(data.flat().map(d => d.position), [0, 0])
let totalRisk = path.slice(1).reduce((prev, point) => prev + getDataOr(point, 0).value, 0)
console.log(totalRisk)