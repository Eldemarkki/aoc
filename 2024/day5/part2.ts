import { readLines } from "../../utils/input";

const lines = readLines("input.txt")

type Rule = {
    before: number,
    after: number
}

const rules: Rule[] = []
const updates: number[][] = []

let hasAddedRules = false
for (const line of lines) {
    if (line.trim() === "") {
        hasAddedRules = true
        continue
    }

    if (hasAddedRules) {
        const update = line.split(",").map(Number);
        updates.push(update)
        if (update.length !== new Set(update).size) {
            console.warn("Duplicate numbers in update", update)
        }
    }
    else {
        const [before, after] = line.split("|").map(Number)
        rules.push({ before, after })
    }
}

const incorrect: number[][] = []
for (const update of updates) {
    for (let i = 0; i < update.length; i++) {
        const element = update[i];
        const before = update.slice(0, i)
        const valid = before.every(b => {
            if (rules.some(r => r.before == element && r.after == b)) {
                return false
            }
            return true
        })
        if (!valid) {
            incorrect.push(update)
            break
        }
    }
}

let result = 0
for (const update of incorrect) {
    const correct = [...update]
    correct.sort((a, b) => {
        if (rules.some(r => r.before === a && r.after === b)) {
            return 1
        }
        else if (rules.some(r => r.before === b && r.after === a)) {
            return -1
        }
        return 0
    })
    result += correct[(correct.length - 1) / 2]
}

console.log(result)