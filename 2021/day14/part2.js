const { readLines } = require("../../utils/input");

const lines = readLines("input.txt")
const originalTemplate = lines[0];

const rules = {}
lines.slice(2).forEach(line => {
  const [input, output] = line.split(" -> ");
  rules[input] = output;
});

const allUsedLetters = Array.from(Object.keys(rules).join("")).filter((key, index, data) => data.indexOf(key) === index);

const applyRules = template => {
  let newTemplate = "";
  for (let i = 0; i < template.length - 1; i++) {
    const pair = template.slice(i, i + 2);
    newTemplate += pair[0] + rules[pair]
  }
  return newTemplate + template[template.length - 1]
}

// Key is the pair, value is the letter counts after 20 iterations
// { AB: { A: 3, B: 5, C: 4, ...} }
const cache = {}

const pairs = [];
allUsedLetters.forEach(l1 => {
  allUsedLetters.forEach(l2 => {
    pairs.push(l1 + l2)
  })
})

// Create the cache
console.log("Starting to create the cache")
const iterationCount = 20
pairs.forEach((pair, i) => {
  let finalTemplate = pair;
  for (let j = 0; j < iterationCount; j++) {
    finalTemplate = applyRules(finalTemplate)
  }

  const finalLetters = Array.from(finalTemplate);
  const counts = {}
  finalLetters.forEach(letter => counts[letter] = (counts[letter] || 0) + 1)
  cache[pair] = counts
})

console.log("Cache created succesfully")

const combineLetterAmounts = (counts) => {
  const final = {}
  counts.forEach(c => {
    Object.keys(c).forEach(letter => {
      final[letter] = (final[letter] || 0) + c[letter]
    })
  })
  return final
}

console.log("Starting to apply the iterations")
let template = originalTemplate;
for (let i = 0; i < iterationCount; i++) {
  console.log(`Starting iteration ${i + 1}/${iterationCount}`)
  template = applyRules(template)
}

console.log("All iterations finished")

const combineCaches = (pairs) => {
  const caches = []
  pairs.forEach((pair, i) => {
    if (i !== 0) {
      const newCache = {
        ...cache[pair],
        [pair[0]]: (cache[pair][pair[0]] || 1) - 1
      }
      caches.push(newCache)
    }
    else {
      caches.push(cache[pair])
    }
  })
  return caches
}

console.log("Combining all letter counts")
const finalCaches = []
for (let i = 0; i < template.length - 1; i++) {
  finalCaches.push(template[i] + template[i + 1])
}

const finalAmounts = combineLetterAmounts(combineCaches(finalCaches))
console.log(finalAmounts)
const values = Object.values(finalAmounts)
const max = Math.max(...values)
const min = Math.min(...values)

console.log(max - min)