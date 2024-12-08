import { readLines } from "../../utils/input";

const lines = readLines("input.txt")

const height = lines.length
const width = lines[0].length

const antennas = new Map<string, [number, number][]>()

for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
        const char = lines[y][x]

        if (char !== ".") {
            if (antennas.has(char)) {
                antennas.get(char)!.push([x, y])
            }
            else {
                antennas.set(char, [[x, y]])
            }
        }
    }
}

const antinodes = new Map<string, [number, number][]>()

function isWithinBounds(x: number, y: number) {
    return x >= 0 && x < width && y >= 0 && y < height;
}

for (const [frequency, nodes] of antennas) {
    antinodes.set(frequency, [])

    for (const a of nodes) {
        for (const b of nodes) {
            if (a[0] === b[0] && a[1] === b[1]) continue

            const diffX = b[0] - a[0]
            const diffY = b[1] - a[1]

            const newX = a[0] + 2 * diffX
            const newY = a[1] + 2 * diffY

            if (isWithinBounds(newX, newY)) {
                antinodes.get(frequency)!.push([newX, newY])
            }
        }
    }
}

const all = new Set<string>()
for (const [frequency, nodes] of antinodes) {
    for (const node of nodes) {
        all.add(`${node[0]},${node[1]}`)
    }
}

console.log(all.size)