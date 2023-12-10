import { readLines } from "../../utils/input";

const lines = readLines("input.txt");

type Tile = {
  x: number;
  y: number;
  isStart: boolean;
  connections: Set<string>;
};

const uncheckedMap = new Map<string, Tile>();

lines.forEach((line, y) => {
  line.split("").forEach((char, x) => {
    if (char === ".") {
      return;
    }

    const connections: { x: number; y: number }[] = [];
    if (char === "F") {
      connections.push(
        {
          x,
          y: y + 1,
        },
        {
          x: x + 1,
          y,
        }
      );
    } else if (char === "7") {
      connections.push(
        {
          x: x - 1,
          y,
        },
        {
          x,
          y: y + 1,
        }
      );
    } else if (char === "|") {
      connections.push(
        {
          x,
          y: y + 1,
        },
        {
          x,
          y: y - 1,
        }
      );
    } else if (char === "-") {
      connections.push(
        {
          x: x - 1,
          y,
        },
        {
          x: x + 1,
          y,
        }
      );
    } else if (char === "J") {
      connections.push(
        {
          x: x - 1,
          y,
        },
        {
          x,
          y: y - 1,
        }
      );
    } else if (char === "L") {
      connections.push(
        {
          x: x + 1,
          y,
        },
        {
          x,
          y: y - 1,
        }
      );
    } else if (char === "S") {
      if (["7", "-", "J"].includes(lines[y][x + 1])) {
        connections.push({ x: x + 1, y });
      }
      if (y + 1 < lines.length && ["|", "J", "L"].includes(lines[y + 1][x])) {
        connections.push({ x, y: y + 1 });
      }
      if (x > 0 && ["-", "L", "F"].includes(lines[y][x - 1])) {
        connections.push({ x: x - 1, y });
      }
      if (y > 0 && ["|", "7", "F"].includes(lines[y - 1][x])) {
        connections.push({ x, y: y - 1 });
      }

      if (connections.length !== 2) {
        throw new Error(
          "Expected exactly 2 connections to start. Now: " +
            connections.map(({ x, y }) => `${x}/${y}`).join(", ")
        );
      }
    } else {
      throw new Error("Invalid char " + char);
    }

    uncheckedMap.set(x + "-" + y, {
      x,
      y,
      isStart: char === "S",
      connections: new Set(connections.map((c) => c.x + "-" + c.y)),
    });
  });
});

const map = new Map<string, Tile>();

[...uncheckedMap].forEach(([tileCoord, tile]) => {
  const validConnections = [...tile.connections.values()].filter(
    (connectionCoord) => {
      const connectedTile = uncheckedMap.get(connectionCoord);
      // console.log(connectionCoord, connectedTile);
      if (!connectedTile) return false;
      return connectedTile.connections.has(tileCoord);
    }
  );
  // console.log([...tile.connections.values()]);
  map.set(tileCoord, {
    x: parseInt(tileCoord.split("-")[0]),
    y: parseInt(tileCoord.split("-")[1]),
    isStart: tile.isStart,
    connections: new Set(validConnections),
  });
});

// console.log(map);

const visited = new Map<string, number>();
const stack: (Tile & { depth: number })[] = [
  { ...[...map.values()].find((t) => t.isStart)!, depth: 0 },
];
if (stack.length !== 1) throw new Error("Didn't find start");

while (stack.length > 0) {
  const tile = stack.shift()!;
  visited.set(tile.x + "-" + tile.y, tile.depth);
  for (const neighbor of tile.connections) {
    if (
      !visited.has(neighbor) &&
      !stack.some((t) => t.x + "-" + t.y === neighbor)
    ) {
      stack.push({ ...map.get(neighbor)!, depth: tile.depth + 1 });
    }
  }
}

// console.log(visited);

console.log(Math.max(...visited.values()));
