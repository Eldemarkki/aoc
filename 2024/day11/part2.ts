import { readLines } from "../../utils/input";

let nums = readLines("input.txt")[0].split(" ").map(Number)

const n = 25

const cache = new Map<number, Map<number, number>>()

const simulate = (x: number, n: number) => {
    if (cache.has(x)) return cache.get(x)!

    let counts = new Map<number, number>()
    let nums = [x]
    for (let i = 0; i < n; i++) {
        nums = nums.flatMap((x) => {
            let res: number[] | undefined = undefined
            if (x === 0) {
                res = [1]
            }
            else if (x.toString().length % 2 === 0) {
                res = [
                    parseInt(x.toString().substring(0, x.toString().length / 2)),
                    parseInt(x.toString().substring(x.toString().length / 2))
                ]
            }
            else {
                res = [x * 2024]
            }

            return res
        })
    }

    for (const y of nums) {
        const original = counts.get(y);
        counts.set(y, (original ?? 0) + 1)
    }

    cache.set(x, counts)

    return counts
}

function multiplyMapValues<T>(m: Map<T, number>, x: number) {
    const newMap = new Map<T, number>()
    for (const [key, value] of m.entries()) {
        newMap.set(key, value * x)
    }
    return newMap
}

let result = 0;
for (let i = 0; i < nums.length; i++) {
    const r = simulate(nums[i], n)
    const r2 = [...r.entries()].map(([key, value]) => multiplyMapValues(simulate(key, n), value))
    const r3 = r2.flatMap(x => [...x.entries()].map(([key, value]) => multiplyMapValues(simulate(key, n), value)))

    result += r3.reduce((s, c) => s + [...c.values()].reduce((s2, c2) => s2 + c2, 0), 0)
}

console.log(result)
