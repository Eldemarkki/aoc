import { readLines } from "../../utils/input";

const line = readLines("input.txt").join(",")

const regex = /mul\((\d{1,3}),(\d{1,3})\)/gm
const matches = line.matchAll(regex)

let result = 0
for (const match of matches) {
    const a = parseInt(match[1])
    const b = parseInt(match[2])
    result += a * b
}

console.log(result)
