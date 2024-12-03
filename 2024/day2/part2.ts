import { readLines } from "../../utils/input";

const isSafe = (nums: number[]) => {
    const sign = Math.sign(nums[1] - nums[0])
    for (let i = 0; i < nums.length - 1; i++) {
        const diff = nums[i + 1] - nums[i]
        if (!(1 <= Math.abs(diff) && Math.abs(diff) <= 3) || Math.sign(diff) != sign) {
            return false
        }
    }
    return true
}

const lines = readLines("input.txt")
let result = 0
for (const line of lines) {
    const nums = line.split(" ").map(Number)
    for (let i = 0; i < nums.length; i++) {
        const new_nums = [...nums]
        new_nums.splice(i, 1)
        if (isSafe(new_nums)) {
            result += 1
            break
        }
    }
}

console.log(result)