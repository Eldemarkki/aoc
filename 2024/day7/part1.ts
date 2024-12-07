import { readLines } from "../../utils/input";

const lines = readLines("input.txt")

function isValid(x: number, nums: number[]) {
    if (nums.length === 1) return x === nums[0]

    if (nums.length == 2) {
        if (x === nums[0] * nums[1]) return true
        if (x === nums[0] + nums[1]) return true
        return false
    }

    return isValid(x, [nums[0] * nums[1], ...nums.slice(2)]) || isValid(x, [nums[0] + nums[1], ...nums.slice(2)])
}

let total = 0
for (const line of lines) {
    const [resultStr, parts] = line.split(": ")
    const result = Number(resultStr)
    const nums = parts.split(" ").map(Number)

    if (isValid(result, nums)) {
        total += result
    }
}

console.log(total)