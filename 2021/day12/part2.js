const { readLines } = require("../../utils/input");

const nodes = {};

const addConnectionToNode = (start, end) => {
  if (nodes[start]) {
    nodes[start] = {
      ...nodes[start], connections: [
        ...nodes[start].connections,
        end
      ]
    }
  }
  else {
    nodes[start] = {
      letter: start,
      connections: [end]
    }
  }
}

const isSmallCave = (cave) => String(cave) === String(cave).toLowerCase();

readLines().forEach(line => {
  const [start, end] = line.split("-");
  addConnectionToNode(start, end)
  addConnectionToNode(end, start)
})

let count = 0;
const traverse = (nodes, startNode = "start", smallCavesVisited = {}, originalPath = []) => {
  if (startNode === "end") {
    count++;
    return;
  }

  const start = nodes[startNode]

  // Only add small caves to the path
  const path = isSmallCave(start.letter) ? [...originalPath, start.letter] : [...originalPath]

  let twoCounts = 0;
  path.reduce((prev, cave) => {
    const newCount = (prev[cave] || 0) + 1;
    if (newCount === 2) twoCounts++;
    return {
      ...prev,
      [cave]: newCount
    }
  }, {})

  if (twoCounts >= 2) return;

  if (isSmallCave(startNode)) smallCavesVisited[startNode] = (smallCavesVisited[startNode] || 0) + 1

  const connections = start.connections.filter(cave => smallCavesVisited[cave] !== 2 && cave !== "start");

  for (const cave of connections) {
    traverse(nodes, cave, { ...smallCavesVisited }, path)
  }
}

traverse(nodes)
console.log(count)
