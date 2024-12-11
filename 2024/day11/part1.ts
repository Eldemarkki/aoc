import { readLines } from "../../utils/input";

let nums = readLines("input.txt")[0].split(" ").map(Number)

const n = 25

for (let i = 0; i < n; i++) {
    nums = nums.flatMap((x) => {
        if (x === 0) {
            return 1
        }
        else if (x.toString().length % 2 === 0) {
            return [
                parseInt(x.toString().substring(0, x.toString().length / 2)),
                parseInt(x.toString().substring(x.toString().length / 2))
            ]
        }
        else {
            return x * 2024
        }
    })
}

console.log(nums.length)
