import { readLines } from "../../utils/input";
const lines = readLines("demo.txt") as string[];

type Point = {
  x: number,
  y: number
  height: string;
  connections: string[];
  type: "start" | "end" | "normal";
}

const nodes: Record<string, Point> = {};

const addConnectionToNode = (start: Point, end: Point) => {
  const startId = `${start.x},${start.y}`;
  nodes[startId] = {
    ...nodes[startId],
    connections: [
      ...nodes[startId].connections,
      end.x + "," + end.y
    ]
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

    let neighborHash = "...."
    if (x > 0) {
      const neighborHeight = getHeight(line[x - 1]).charCodeAt(0);
      if (Math.abs(currentHeight.charCodeAt(0) - neighborHeight) <= 1) {
        neighbors.push({
          x: x - 1, y, height: getHeight(line[x - 1]), connections: [], type: getType(line[x - 1])
        })
        neighborHash = "X" + neighborHash.slice(1)
      }
    }
    if (x < line.length - 1) {
      const neighborHeight = getHeight(line[x + 1]).charCodeAt(0);
      if (Math.abs(currentHeight.charCodeAt(0) - neighborHeight) <= 1) {
        neighbors.push({
          x: x + 1, y, height: getHeight(line[x + 1]), connections: [], type: getType(line[x + 1])
        })
        neighborHash = neighborHash.slice(0, 1) + "X" + neighborHash.slice(2)
      }
    }
    if (y > 0) {
      const neighborHeight = getHeight(lines[y - 1][x]).charCodeAt(0);
      if (Math.abs(currentHeight.charCodeAt(0) - neighborHeight) <= 1) {
        neighbors.push({
          x, y: y - 1, height: getHeight(lines[y - 1][x]), connections: [], type: getType(lines[y - 1][x])
        })
        neighborHash = neighborHash.slice(0, 2) + "X" + neighborHash.slice(3)
      }
    }
    if (y < lines.length - 1) {
      const neighborHeight = getHeight(lines[y + 1][x]).charCodeAt(0);
      if (Math.abs(currentHeight.charCodeAt(0) - neighborHeight) <= 1) {
        neighbors.push({
          x, y: y + 1, height: getHeight(lines[y + 1][x]), connections: [], type: getType(lines[y + 1][x])
        })
        neighborHash = neighborHash.slice(0, 3) + "X"
      }
    }

    console.log(x + "," + y, neighborHash)

    nodes[`${x},${y}`] = current;

    neighbors.forEach(neighbor => {
      addConnectionToNode(current, neighbor)
    })
  }
}

let minLength = 100000
const traverse = (nodes: Record<string, Point>, startNode: Point, visited: Set<string>, length: number) => {
  if (startNode.type === "end") {
    if (length < minLength) {
      minLength = length;
    }
    return;
  }

  const connections = startNode.connections.filter(caveCoords => {
    return !visited.has(caveCoords);
  });

  visited.add(startNode.x + "," + startNode.y)

  for (const cave of connections) {
    traverse(nodes, nodes[cave], new Set(visited), length + 1)
  }
}

traverse(nodes, nodes[startId!], new Set(), 0)

let ccc = 0;
Object.entries(nodes).forEach(([key, value]) => {
  ccc += value.connections.length;
});

console.log(ccc)