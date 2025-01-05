import { readLines } from "../../utils/input";

const lines = readLines("input.txt")

const parseButton = (line: string) => {
    const parts = line.split(" ")
    return {
        x: parseInt(parts[2].substring(2, parts[2].length - 1)),
        y: parseInt(parts[3].substring(2))
    }
}

const parsePrize = (line: string) => {
    const parts = line.split(" ")
    return {
        x: parseInt(parts[1].substring(2, parts[1].length - 1)),
        y: parseInt(parts[2].substring(2))
    }
}

let result = 0
for (let i = 0; i < (lines.length + 1) / 4; i++) {
    const b1 = parseButton(lines[i * 4 + 0])
    const b2 = parseButton(lines[i * 4 + 1])
    const prize = parsePrize(lines[i * 4 + 2])

    let minPrice = Infinity
    for (let a = 0; a <= 100; a++) {
        for (let b = 0; b <= 100; b++) {
            const x = a * b1.x + b * b2.x
            const y = a * b1.y + b * b2.y
            const price = 3 * a + b
            if (x === prize.x && y === prize.y) {
                minPrice = Math.min(minPrice, price)
            }
        }
    }

    if (minPrice !== Infinity)
        result += minPrice
}

console.log(result)
