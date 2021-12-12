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
const traverse = (nodes, startNode = "start", smallCavesVisited = []) => {
  const start = nodes[startNode]
  if (startNode === "end") {
    count++;
    return;
  }

  const connections = start.connections.filter(cave => !smallCavesVisited.includes(cave) && cave !== "start");
  if (isSmallCave(startNode)) smallCavesVisited.push(startNode)

  for (const cave of connections) {
    traverse(nodes, cave, [...smallCavesVisited])
  }
}

traverse(nodes)
console.log(count)
