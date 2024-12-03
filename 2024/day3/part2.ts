import { readLines } from "../../utils/input";

const line = readLines("input.txt").join(",")

const regex1 = /mul\((\d{1,3}),(\d{1,3})\)/gm
const matches1 = [...line.matchAll(regex1)]

const regex2 = /don't\(\)/gm
const matches2 = [...line.matchAll(regex2)]

const regex3 = /do\(\)/gm
const matches3 = [...line.matchAll(regex3)]

const matches = matches1.concat(matches2).concat(matches3)
matches.sort((a, b) => a.index - b.index)

let result = 0
let enabled = true
for (const match of matches) {
    if (match[0] == "don't()") enabled = false
    else if (match[0] == "do()") enabled = true
    else if (enabled) { 
        const a = parseInt(match[1])
        const b = parseInt(match[2])
        result += a * b
    }
}

console.log(result)
