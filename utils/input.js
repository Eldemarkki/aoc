import fs from "fs"
import { join, dirname } from "path";

/**
 * 
 * @param {string} [file] 
 */
export const readLines = (file) => {
  const inputPath = join(dirname(process.argv[1]), file || "input.txt");
  return fs.readFileSync(inputPath, "utf8").toString().trim().split("\n");
}

/**
 * 
 * @param {string} [file]
 */
export const readLinesDontTrim = (file) => {
  const inputPath = join(dirname(process.argv[1]), file || "input.txt");
  return fs.readFileSync(inputPath, "utf8").toString().split("\n");
}

/**
 * 
 * @param {string} file
 * @param {number} radix
 */
export const readNumberList = (file, radix) => {
  return readLines(file).map(line => parseInt(line, radix || 10));
}
