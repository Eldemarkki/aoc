import { readLines } from "../../utils/input";

const lines = readLines("demo.txt")

const height = lines.length
const width = lines[0].length

const zeros = [] as { x: number, y: number }[]

for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
        const element = lines[y][x];
        if (element === "0") {
            zeros.push({ x, y })
        }
    }
}

const calculateScore = (x: number, y: number) => {
    const toVisit = [{ x, y }]

    const reachable = new Set<string>()
    const visited = new Set<string>()

    while (toVisit.length > 0) {
        const element = toVisit.pop()
        if (!element) continue

        const key = `${element.x},${element.y}`
        if (visited.has(key)) {
            continue
        }

        visited.add(key)

        if (lines[element.y][element.x] === "9") {
            reachable.add(key)
            continue
        }

        const nextHeight = parseInt(lines[element.y][element.x]) + 1
        for (const offset of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            const newX = element.x + offset[0]
            const newY = element.y + offset[1]

            if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
                if (parseInt(lines[newY][newX]) === nextHeight) {
                    toVisit.push({ x: newX, y: newY })
                }
            }
        }
    }

    return reachable.size
}

const sum = zeros.reduce((s, c) => s + calculateScore(c.x, c.y), 0)

console.log(sum)