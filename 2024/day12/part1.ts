import { readLines } from "../../utils/input";

const lines = readLines("input.txt")

type Tile = { x: number, y: number, letter: string }

const calculatePerimeter = (tiles: Tile[]) => {
    let result = 0

    for (const tile of tiles) {
        for (const offset of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
            const newX = tile.x + offset[0]
            const newY = tile.y + offset[1]

            if (!tiles.some(t => t.x === newX && t.y === newY)) {
                result++
            }
        }
    }

    return result
}

const floodFill = (x: number, y: number) => {
    const letter = lines[y][x]

    const visited = new Set<string>()
    const visitedNodes: [number, number][] = []
    const toVisit: [number, number][] = [[x, y]]

    while (toVisit.length > 0) {
        const node = toVisit.pop()!

        const key = `${node[0]},${node[1]}`

        if (visited.has(key))
            continue

        visitedNodes.push(node)

        visited.add(key)

        for (const offset of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
            const newX = node[0] + offset[0]
            const newY = node[1] + offset[1]

            if (newX >= 0 && newX < width && newY >= 0 && newY < height && lines[newY][newX] === letter) {
                toVisit.push([newX, newY])
            }
        }
    }

    return visitedNodes
}

const height = lines.length
const width = lines[0].length
const visited = new Set<string>()
const groups: Tile[][] = []

for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
        const key = `${x},${y}`
        if (visited.has(key)) continue

        const fill = floodFill(x, y)
        groups.push(fill.map((f) => ({
            letter: lines[f[1]][f[0]],
            x: f[0],
            y: f[1]
        })))

        fill.forEach(f => {
            visited.add(`${f[0]},${f[1]}`)
        })
    }
}

let result = 0;

for (const group of groups) {
    const per = calculatePerimeter(group);
    const price = group.length * per

    result += price
}

console.log(result)
