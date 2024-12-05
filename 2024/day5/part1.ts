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

// console.log(rules)
// console.log(updates)

let result = 0
for (const update of updates) {
    let allValid = true;
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
            allValid = false;
            break
        }
    }
    if (allValid) {
        result += update[(update.length - 1) / 2]
    }
}
console.log(result)