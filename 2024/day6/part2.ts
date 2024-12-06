import { readLines } from "../../utils/input";

type Deflection = {
    point: { x: number, y: number },
    outgoingDeflectionPointIds: [
        string | undefined, // This point was hit from below
        string | undefined, // This point was hit from left
        string | undefined, // This point was hit from above
        string | undefined, // This point was hit from right
    ]
}

const lines = readLines("input.txt")

const height = lines.length
const width = lines[0].length

const movements = [
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
]

function isWithinBounds(x: number, y: number) {
    return x >= 0 && x < width && y >= 0 && y < height
}

const obstacles = new Set<string>()
let startPosition = { x: -1, y: -1 }

for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
        if (lines[y][x] === "^") {
            startPosition = { x, y }
        }
        else if (lines[y][x] === "#") {
            obstacles.add(`${x},${y}`)
        }
    }
}

function isFree(x: number, y: number) {
    if (!isWithinBounds(x, y)) return false
    if (obstacles.has(`${x},${y}`)) return false

    return true
}

function updateDeflection(deflection: Deflection, dirs: number[] = [0, 1, 2, 3]) {
    for (const d of dirs) {
        let p = { ...deflection.point }

        const movement = movements[d];

        while (true) {
            if (!isWithinBounds(p.x, p.y)) {
                break
            }

            if (obstacles.has(`${p.x + movement.x},${p.y + movement.y}`)) {
                deflection.outgoingDeflectionPointIds[d] = `${p.x},${p.y}`
                break
            }
            else {
                deflection.outgoingDeflectionPointIds[d] = undefined
            }

            p.x += movement.x
            p.y += movement.y
        }
    }
}


function hasLoop() {
    let direction = 0
    let guardPosition = { x: startPosition.x, y: startPosition.y }

    while (true) {
        const movement = movements[direction]

        if (!isWithinBounds(guardPosition.x, guardPosition.y)) {
            return false
        }

        if (obstacles.has(`${guardPosition.x + movement.x},${guardPosition.y + movement.y}`)) {
            break
        }

        guardPosition.x += movement.x
        guardPosition.y += movement.y
    }

    let deflection = deflections.get(`${guardPosition.x},${guardPosition.y}`)!

    const visited = new Set<string>()
    while (true) {
        direction = (direction + 1) % 4
        const nextDeflectionId = deflection.outgoingDeflectionPointIds[direction];
        if (nextDeflectionId === undefined) {
            return false
        }

        const key = `${nextDeflectionId},${direction}`
        if (visited.has(key)) {
            return true
        }
        visited.add(key)

        deflection = deflections.get(nextDeflectionId)!
    }

}
const deflections = new Map<string, Deflection>()

for (const obstacle of obstacles) {
    for (const offset of movements) {
        const [xs, ys] = obstacle.split(",")
        const x = parseInt(xs, 10)
        const y = parseInt(ys, 10)
        const newX = x + offset.x
        const newY = y + offset.y

        if (!isFree(newX, newY)) continue

        const deflection: Deflection = {
            outgoingDeflectionPointIds: [undefined, undefined, undefined, undefined],
            point: { x: newX, y: newY },
        }

        deflections.set(`${newX},${newY}`, deflection)
    }
}

for (const deflection of deflections) {
    updateDeflection(deflection[1])
}


function updateRowAndColumnForNewLoopObstacle(x: number, y: number) {
    // for each deflection on this row
    for (let xLeft = x - 1; xLeft >= 0; xLeft--) {
        if (obstacles.has(`${xLeft},${y}`)) {
            break
        }

        const def = deflections.get(`${xLeft},${y}`)
        if (def) {
            updateDeflection(def, [1])
        }
    }

    for (let xRight = x + 1; xRight < width; xRight++) {
        if (obstacles.has(`${xRight},${y}`)) {
            break
        }

        const def = deflections.get(`${xRight},${y}`)
        if (def) {
            updateDeflection(def, [3])
        }
    }

    // for each deflection on this column
    for (let yAbove = y - 1; yAbove >= 0; yAbove--) {
        if (obstacles.has(`${x},${yAbove}`)) {
            break
        }

        const deflection = deflections.get(`${x},${yAbove}`)
        if (deflection !== undefined) {
            updateDeflection(deflection, [2])
        }
    }

    for (let yBelow = y + 1; yBelow < height; yBelow++) {
        if (obstacles.has(`${x},${yBelow}`)) {
            break
        }

        const deflection = deflections.get(`${x},${yBelow}`)
        if (deflection !== undefined) {
            updateDeflection(deflection, [0])
        }
    }
}

let loops = 0

function testLoop(x: number, y: number) {
    const loopKey = `${x},${y}`
    obstacles.add(loopKey)

    updateRowAndColumnForNewLoopObstacle(x, y)

    const newDeflections = [] as string[]
    for (const offset of movements) {
        const newX = x + offset.x
        const newY = y + offset.y

        if (!isFree(newX, newY)) continue

        const deflection: Deflection = {
            outgoingDeflectionPointIds: [undefined, undefined, undefined, undefined],
            point: { x: newX, y: newY },
        }

        const key = `${newX},${newY}`;
        if (!deflections.has(key)) {
            newDeflections.push(key)
        }
        deflections.set(key, deflection)
        updateDeflection(deflection)
    }

    if (hasLoop()) {
        loops += 1
    }

    obstacles.delete(loopKey)

    for (const key of newDeflections) {
        deflections.delete(key)
    }

    updateRowAndColumnForNewLoopObstacle(x, y)
}

for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
        if (startPosition.x === x && startPosition.y === y) continue
        if (obstacles.has(`${x},${y}`)) continue

        testLoop(x, y)
    }
}

console.log(loops)
