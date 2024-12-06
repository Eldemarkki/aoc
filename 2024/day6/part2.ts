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

type Visited = { position: Position, direction: number }

const hasLoop = (loopX: number, loopY: number) => {
    let guardPosition: Position = { x: startPosition.x, y: startPosition.y }
    let direction = 0

    let visited = [{ position: guardPosition, direction: 0 }] as Visited[];

    const tryMoveDirection = (dir: number): "obstacle" | "valid" | "outside" | "loop" => {
        const movement = movements[dir]
        const newPosition = { x: guardPosition.x + movement.x, y: guardPosition.y + movement.y } satisfies Position
        if ((newPosition.x === loopX && newPosition.y === loopY) || obstacles.some(p => p.x === newPosition.x && p.y === newPosition.y)) {
            return "obstacle"
        }
        if (newPosition.x >= 0 && newPosition.x < width && newPosition.y >= 0 && newPosition.y < height) {
            guardPosition = newPosition

            if (visited.some(p => p.position.x === guardPosition.x && p.position.y === guardPosition.y && p.direction === dir)) {
                return "loop"
            }

            if (!visited.some(p => p.position.x === guardPosition.x && p.position.y === guardPosition.y)) {
                visited.push({ position: guardPosition, direction: dir })
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
                }
                else if (x === loopX && y === loopY) {
                    board += "O"
                }
                else if (obstacles.some(p => p.x === x && p.y === y)) {
                    board += "#"
                } else if (visited.some(p => p.position.x === x && p.position.y === y)) {
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
        if (moveResult === "loop") {
            return true
        }
        if (moveResult === "outside") {
            return false
        }
    }
}

let loops = 0

for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
        if (hasLoop(x, y)) {
            loops += 1
        }
        const i = y * height + x
        console.log(i / (width * height) * 100 + "%")
    }
}

console.log(loops)