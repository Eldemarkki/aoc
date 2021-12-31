const { readLines } = require("../../utils/input");

const lines = readLines("input.txt");

const regionSize = 50

const areas = lines.map(line => ({
  active: line.split(" ")[0] === "on",
  area: line.split(" ")[1].split(",").map(component => component.slice(2).split("..").map(Number))
}))

const isPointInArea = (point, area) => {
  const xs = area[0]
  const ys = area[1]
  const zs = area[2]
  return xs[0] <= point[0] && point[0] <= xs[1] &&
    ys[0] <= point[1] && point[1] <= ys[1] &&
    zs[0] <= point[2] && point[2] <= zs[1]
};

const region = {}
areas.forEach(area => {
  for (let x = -regionSize; x <= regionSize; x++) {
    for (let y = -regionSize; y <= regionSize; y++) {
      for (let z = -regionSize; z <= regionSize; z++) {
        if (isPointInArea([x, y, z], area.area)) {
          region[[x, y, z]] = area.active;
        }
      }
    }
  }
})

console.log(Object.values(region).filter(v => v).length)