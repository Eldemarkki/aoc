const { readLines } = require("../../utils/input");

console.time("part2")
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

const finalPaths = []
const traverse = (nodes, startNode = "start", smallCavesVisited = {}, originalPath = []) => {
  const start = nodes[startNode]
  const path = [...originalPath, start.letter];
  if (startNode === "end") {
    finalPaths.push(path)
    return;
  }

  if (isSmallCave(startNode)) smallCavesVisited[startNode] = (smallCavesVisited[startNode] || 0) + 1

  const connections = start.connections.filter(cave => {
    const smallCaveCounts = path.reduce((prev, cave) => {
      if (!isSmallCave(cave) || cave === "start" || cave === "end") return prev;

      return {
        ...prev,
        [cave]: (prev[cave] || 0) + 1
      }
    }, {})

    const twoCounts = Object.values(smallCaveCounts).reduce((prev, curr) => curr === 2 ? prev + 1 : prev, 0);
    return twoCounts < 2 && smallCavesVisited[cave] !== 2 && cave !== "start"
  });

  for (const cave of connections) {
    traverse(nodes, cave, { ...smallCavesVisited }, path)
  }
}

traverse(nodes)

const filtered = finalPaths.filter(path => {
  const smallCaveCounts = path.reduce((prev, cave) => {
    if (!isSmallCave(cave) || cave === "start" || cave === "end") return prev;

    return {
      ...prev,
      [cave]: (prev[cave] || 0) + 1
    }
  }, {})

  const twoCounts = Object.values(smallCaveCounts).reduce((prev, curr) => curr === 2 ? prev + 1 : prev, 0);

  return twoCounts < 2;
})

console.log(filtered.length)
console.timeEnd("part2")