const { readLines } = require("../../utils/input");

const lines = readLines("input.txt")
const originalTemplate = lines[0];
const rules = {}
lines.slice(2).forEach(line => {
  const [input, output] = line.split(" -> ");
  rules[input] = output;
});

const applyRules = template => {
  let newTemplate = "";
  for (let i = 0; i < template.length - 1; i++) {
    const pair = template.slice(i, i + 2);
    if (Object.keys(rules).includes(pair)) {
      newTemplate += pair[0] + rules[pair]
    }
    else {
      newTemplate += pair[0];
    }
  }
  return newTemplate + template[template.length - 1]
}

let template = originalTemplate;
for (let i = 0; i < 10; i++) {
  template = applyRules(template)
}

const counts = {};
for (const letter of Array.from(template)) {
  counts[letter] = (counts[letter] || 0) + 1
};

const values = Object.values(counts)
const max = Math.max(...values)
const min = Math.min(...values)

console.log(max - min)