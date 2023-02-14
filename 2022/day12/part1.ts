import { readLines } from "../../utils/input";
const lines = readLines() as string[];

type Point = {
  x: number,
  y: number
  height: string;
  connections: { x: number, y: number }[];
  type: "start" | "end" | "normal";
}

const nodes: Record<string, Point> = {};

const addConnectionToNode = (start: Point, end: Point) => {
  const startId = `${start.x},${start.y}`;
  if (nodes[startId]) {
    nodes[startId] = {
      ...nodes[startId],
      connections: [
        ...nodes[startId].connections,
        end
      ]
    }
  }
  else {
    nodes[startId] = {
      ...start,
      connections: [end]
    }
  }
}

const getType = (height: string) => {
  if (height === "S") return "start";
  if (height === "E") return "end";
  return "normal";
}

const getHeight = (height: string) => {
  switch (getType(height)) {
    case "start": return "a";
    case "end": return "z";
    default: return height;
  }
}

let startId: string | undefined = undefined;

for (let y = 0; y < lines.length; y++) {
  const line = lines[y];
  for (let x = 0; x < line.length; x++) {
    // get neighbors
    let neighbors: Point[] = [];


    const currentHeight = getHeight(line[x]);
    if (line[x] === "S") {
      startId = `${x},${y}`;
    }

    const current: Point = {
      x, y, height: currentHeight, connections: [], type: getType(line[x])
    }

    if (x > 0) {
      const neighborHeight = getHeight(line[x - 1]).charCodeAt(0);
      if (Math.abs(currentHeight.charCodeAt(0) - neighborHeight) <= 1) {
        neighbors.push({
          x: x - 1, y, height: getHeight(line[x - 1]), connections: [], type: getType(line[x - 1])
        })
      }
    }
    if (x < line.length - 1) {
      const neighborHeight = getHeight(line[x + 1]).charCodeAt(0);
      if (Math.abs(currentHeight.charCodeAt(0) - neighborHeight) <= 1) {
        neighbors.push({
          x: x + 1, y, height: getHeight(line[x + 1]), connections: [], type: getType(line[x + 1])
        })
      }
    }
    if (y > 0) {
      const neighborHeight = getHeight(lines[y - 1][x]).charCodeAt(0);
      if (Math.abs(currentHeight.charCodeAt(0) - neighborHeight) <= 1) {
        neighbors.push({
          x, y: y - 1, height: getHeight(lines[y - 1][x]), connections: [], type: getType(lines[y - 1][x])
        })
      }
    }
    if (y < lines.length - 1) {
      const neighborHeight = getHeight(lines[y + 1][x]).charCodeAt(0);
      if (Math.abs(currentHeight.charCodeAt(0) - neighborHeight) <= 1) {
        neighbors.push({
          x, y: y + 1, height: getHeight(lines[y + 1][x]), connections: [], type: getType(lines[y + 1][x])
        })
      }
    }

    nodes[`${x},${y}`] = current;

    neighbors.forEach(neighbor => {
      addConnectionToNode(current, neighbor)
    })
  }
}

console.log("parsed")

let cycle = 0;
let minLength = 100000
const traverse = (nodes: Record<string, Point>, startNode: Point, smallCavesVisited: { x: number, y: number }[] = [], length: number = 0) => {
  if (startNode.type === "end") {
    if (length < minLength) {
      minLength = length;
    }
    return;
  }


  cycle++;
  if (cycle % 100000 === 0) console.log(cycle, minLength)

  const connections = startNode.connections.filter(caveCoords => {
    const cave = nodes[`${caveCoords.x},${caveCoords.y}`]
    return !smallCavesVisited.some(c => c.x === caveCoords.x && c.y === caveCoords.y) && cave.type !== "start";
  });

  smallCavesVisited.push({
    x: startNode.x,
    y: startNode.y
  })

  for (const cave of connections) {
    traverse(nodes, nodes[cave.x + "," + cave.y], [...smallCavesVisited], length + 1)
  }
}

traverse(nodes, nodes[startId!], [])
console.log(minLength)