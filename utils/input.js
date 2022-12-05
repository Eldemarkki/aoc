import fs from "fs"
import { join, dirname } from "path";

export const readLines = (file) => {
  const inputPath = join(dirname(process.argv[1]), file || "input.txt");
  return fs.readFileSync(inputPath, "utf8").toString().trim().split("\n");
}

export const readLinesDontTrim = (file) => {
  const inputPath = join(dirname(process.argv[1]), file || "input.txt");
  return fs.readFileSync(inputPath, "utf8").toString().split("\n");
}

export const readNumberList = (file, radix) => {
  return readLines(file).map(line => parseInt(line, radix || 10));
}
