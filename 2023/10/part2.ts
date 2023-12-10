import { readLines } from "../../utils/input";

const lines = readLines("input.txt");
type TileType = "S" | "-" | "7" | "F" | "L" | "J" | "|";

type Tile = {
  x: number;
  y: number;
  type: TileType;
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
      type: char as TileType,
      isStart: char === "S",
      connections: new Set(connections.map((c) => c.x + "-" + c.y)),
    });
  });
});

const removeDangling = (m: Map<string, Tile>) => {
  const map = new Map<string, Tile>();
  [...m].forEach(([tileCoord, tile]) => {
    const validConnections = [...tile.connections.values()].filter(
      (connectionCoord) => {
        const connectedTile = m.get(connectionCoord);
        // console.log(connectionCoord, connectedTile);
        if (!connectedTile) return false;
        return connectedTile.connections.has(tileCoord);
      }
    );
    // console.log([...tile.connections.values()]);
    if (validConnections.length === 2) {
      map.set(tileCoord, {
        x: parseInt(tileCoord.split("-")[0]),
        y: parseInt(tileCoord.split("-")[1]),
        isStart: tile.isStart,
        type: tile.type,
        connections: new Set(validConnections),
      });
    }
  });
  return map;
};

let map = removeDangling(uncheckedMap);
while (true) {
  const newMap = removeDangling(map);
  if (newMap.size === map.size) {
    break;
  } else {
    map = newMap;
  }
}

console.log("removed dangling");

type Line = [
  {
    x: number;
    y: number;
  },
  {
    x: number;
    y: number;
  }
];

const polygonLines: Line[] = [];

[...map.entries()].forEach(([_, tile], i, data) => {
  tile.connections.forEach((c) => {
    const [cx, cy] = c.split("-").map(Number);
    const l: Line = [
      {
        x: tile.x,
        y: tile.y,
      },
      {
        x: cx,
        y: cy,
      },
    ];
    l.sort((a, b) => {
      if (a.x - b.x === 0) {
        return a.y - b.y;
      }
      return a.x - b.x;
    });

    if (
      !polygonLines.some(
        (ll) =>
          ll[0].x === l[0].x &&
          ll[0].y === l[0].y &&
          ll[1].x === l[1].x &&
          ll[1].y === l[1].y
      )
    ) {
      polygonLines.push(l);
    }
  });
  console.log(`generated lines for ${i}/${data.length}`);
});

type Point = {
  x: number;
  y: number;
};

// https://stackoverflow.com/a/9997374/8715999
const ccw = (A: Point, B: Point, C: Point) =>
  (C.y - A.y) * (B.x - A.x) > (B.y - A.y) * (C.x - A.x);
const intersect = (A: Point, B: Point, C: Point, D: Point) => {
  return ccw(A, C, D) !== ccw(B, C, D) && ccw(A, B, C) !== ccw(A, B, D);
};

const isInside = (x: number, y: number) => {
  if (map.get(`${x}-${y}`)) {
    return false;
  }

  let hits = new Set<string>();
  for (let i = x; i < lines[y].length; i++) {
    for (const p of polygonLines) {
      if (intersect({ x: i, y }, { x: lines[y].length + 1, y }, p[0], p[1])) {
        const hit = p.map((p) => `${p.x},${p.y}`).join(" / ");
        hits.add(hit);
        break;
      }
    }
  }
  if (hits.size % 2 !== 0) {
    return true;
  }

  return false;
};

let count = 0;
const total = lines.length * lines[0].length;
let i = 0;
for (let y = 0; y < lines.length; y++) {
  for (let x = 0; x < lines[y].length; x++) {
    if (isInside(x, y)) {
      count++;
    }
    i++;
    console.log(`${i}/${total}`);
  }
}

console.log(count);
