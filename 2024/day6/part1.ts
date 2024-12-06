import { readLines } from "../../utils/input";

type Position = { x: number, y: number }

const lines = readLines("input.txt")

const height = lines.length
const width = lines[0].length

let startPosition: Position = { x: -1, y: -1 }

const obstacles = [] as Position[]

for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
        if (lines[y][x] === "^") {
            startPosition = { x, y }
        }
        else if (lines[y][x] === "#") {
            obstacles.push({ x, y })
        }
    }
}

let guardPosition: Position = { x: startPosition.x, y: startPosition.y }


enum Direction {
    UP,
    RIGHT,
    DOWN,
    LEFT
}

const movements = {
    [Direction.UP]: { x: 0, y: -1 } as Position,
    [Direction.RIGHT]: { x: 1, y: 0 } as Position,
    [Direction.DOWN]: { x: 0, y: 1 } as Position,
    [Direction.LEFT]: { x: -1, y: 0 } as Position,
}

let direction = 0

let visited = [guardPosition] as Position[];

const tryMoveDirection = (dir: number): "obstacle" | "valid" | "outside" => {
    const movement = movements[dir]
    const newPosition = { x: guardPosition.x + movement.x, y: guardPosition.y + movement.y } satisfies Position
    if (obstacles.some(p => p.x === newPosition.x && p.y === newPosition.y)) {
        return "obstacle"
    }
    if (newPosition.x >= 0 && newPosition.x < width && newPosition.y >= 0 && newPosition.y < height) {
        guardPosition = newPosition

        if (!visited.some(p => p.x === guardPosition.x && p.y === guardPosition.y)) {
            visited.push(guardPosition)
        }

        return "valid"
    }

    return "outside"
}

const printBoard = () => {
    let board = ""
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (guardPosition.x === x && guardPosition.y === y) {
                board += ["^", ">", "↓", "<"][direction]
            } else if (obstacles.some(p => p.x === x && p.y === y)) {
                board += "#"
            } else if (visited.some(p => p.x === x && p.y === y)) {
                board += "X"
            }
            else {
                board += "."
            }
        }
        board += "\n"
    }
    console.log(board)
}

while (true) {
    const moveResult = tryMoveDirection(direction % 4)
    if (moveResult === "obstacle") {
        direction = (direction + 1) % 4
    }
    else if (moveResult === "outside") {
        break
    }
}

console.log(visited.length)
