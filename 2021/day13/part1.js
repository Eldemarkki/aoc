const { readLines } = require("../../utils/input");

let points = [];
let folds = [];
readLines().forEach(line => {
  if (line.trim().length === 0) return;
  if (line.startsWith("fold")) {
    const [dir, num] = line.replace("fold along ", "").split("=");
    folds.push([dir, Number(num)])
  }
  else {
    points.push(line.split(",").map(Number));
  }
})

const foldPointY = (point, lineY) => {
  const newY = 2 * lineY - point[1]
  return [point[0], newY]
}

const doFold = (points, fold) => points.map(point => {
  const val = fold[1]
  if (fold[0] === "y") {
    const shouldFold = point[1] < val
    if (shouldFold) {
      return foldPointY(point, val)
    }
    return point;
  }
  else {
    const shouldFold = point[0] > val
    if (shouldFold) {
      const newX = 2 * val - point[0]
      return [newX, point[1]]
    }
    return point;
  }
}).filter((t = {}, a => !(t[a] = a in t)));

folds.slice(0, 1).forEach(fold => {
  points = doFold(points, fold)
});

console.log(points.length)