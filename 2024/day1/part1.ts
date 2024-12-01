import { readLines } from "../../utils/input";

const lines = readLines("input.txt")
const left = [] as number[]
const right = [] as number[]
lines.forEach(line => {
    const [a, b] = line.split("   ").map(Number)
    left.push(a)
    right.push(b)
});

left.sort()
right.sort()

let result = 0
for (let i = 0; i < left.length; i++) {
    result += Math.abs(left[i] - right[i])
}

console.log(result)
