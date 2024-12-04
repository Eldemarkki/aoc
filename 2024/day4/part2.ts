import { readLines } from "../../utils/input";

const word = "MAS"
const reverseWord = "SAM"
const lines = readLines("input.txt")
const height = lines.length
const width = lines[0].length

const getStringCount = (x: number, y: number) => {
    const words: string[] = ["", ""]

    for (let i = 0; i < word.length; i++) {
        const newX = x + i - 1
        const newY = y + i - 1
        if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
            words[0] += lines[newY][newX]
        }

        const newY2 = y - i + 1
        if (newX >= 0 && newX < width && newY2 >= 0 && newY2 < height) {
            words[1] += lines[newY2][newX]
        }
    }
    
    return words.filter(w => w === word || w === reverseWord).length == 2 ? 1 : 0
}

let result = 0
for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
        result += getStringCount(x, y)
    }
}
console.log(result)
