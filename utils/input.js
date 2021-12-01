const fs = require("fs");
const { join, dirname } = require("path");

const readLines = (file) => {
  const inputPath = join(dirname(process.argv[1]), file || "input.txt");
  return fs.readFileSync(inputPath, "utf8").toString().trim().split("\n");
}

const readNumberList = (file, radix) => {
  return readLines(file).map(line => parseInt(line, radix || 10));
}

module.exports = {
  readLines,
  readNumberList
}