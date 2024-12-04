import { readLines } from "../../utils/input";

const word = "XMAS"
const lines = readLines("input.txt")
const height = lines.length
const width = lines[0].length

const directions = [
    [0, 1],
    [1, 1],
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, -1],
    [-1, 0],
    [-1, 1]
]

const getStringCount = (x: number, y: number) => {
    const words: string[] = ["", "", "", "", "", "", "", ""]
    for (let i = 0; i < word.length; i++) {
        for (let dirIndex = 0; dirIndex < directions.length; dirIndex++) {
            const dirMultiplier = directions[dirIndex]
            const newX = x + i * dirMultiplier[0]
            const newY = y + i * dirMultiplier[1]
            if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
                words[dirIndex] += lines[newY][newX]
            }
        }
    }

    return words.filter(w => w === word).length
}

let result = 0
for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
        result += getStringCount(x, y)
    }
}
console.log(result)