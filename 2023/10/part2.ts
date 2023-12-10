import { readLines } from "../../utils/input";

const lines = readLines("input.txt");

type Point = {
  x: number;
  y: number;
};

type Tile = {
  x: number;
  y: number;
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
      connections: new Set(connections.map((c) => c.x + "-" + c.y)),
    });
  });
});

const removeDangling = (m: Map<string, Tile>) => {
  const map = new Map<string, Tile>();

  [...m].forEach(([tileCoord, tile]) => {
    const validConnections: string[] = [];
    for (const connectionCoord of tile.connections) {
      if (m.get(connectionCoord)?.connections.has(tileCoord)) {
        validConnections.push(connectionCoord);
      }
    }

    if (validConnections.length === 2) {
      map.set(tileCoord, {
        x: parseInt(tileCoord.split("-")[0]),
        y: parseInt(tileCoord.split("-")[1]),
        connections: new Set(validConnections),
      });
    }
  });

  return map;
};

let map = uncheckedMap;
while (true) {
  const newMap = removeDangling(map);
  if (newMap.size === map.size) {
    break;
  } else {
    map = newMap;
  }
}

const isInside = (x: number, y: number) => {
  if (map.get(`${x}-${y}`)) {
    return false;
  }

  let hitsCount = 0;
  for (let i = x; i < lines[y].length; i++) {
    const tile = map.get(`${i}-${y}`);
    if (
      tile &&
      [...tile.connections.values()].some(
        (c) => parseInt(c.split("-")[1]) === y - 1
      )
    ) {
      hitsCount++;
    }
  }

  return hitsCount % 2 !== 0;
};

let count = 0;
for (let y = 0; y < lines.length; y++) {
  for (let x = 0; x < lines[y].length; x++) {
    if (isInside(x, y)) {
      count++;
    }
  }
}

console.log(count);
