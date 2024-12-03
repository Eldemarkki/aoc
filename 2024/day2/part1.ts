import { readLines } from "../../utils/input";

const lines = readLines("input.txt")
let result = 0
for (const line of lines) {
    const nums = line.split(" ").map(Number)
    let valid = true
    let sign = Math.sign(nums[1] - nums[0])
    for (let i = 0; i < nums.length - 1; i++) {
        const diff = nums[i + 1] - nums[i]
        if (!(1 <= Math.abs(diff) && Math.abs(diff) <= 3) || Math.sign(diff) != sign) {
            valid = false
            break
        }
    }
    if (valid) {
        result += 1
    }
}

console.log(result)