const { readLines } = require("../../utils/input")

const isNumber = x => !isNaN(Number(x))

const lines = readLines("input.txt")

const checkNumber = number => {
  let numbersUsed = 0;
  const variables = {
    "w": 0,
    "x": 0,
    "y": 0,
    "z": 0
  }

  lines.forEach(line => {
    if (line.startsWith("inp")) {
      const [command, target] = line.split(" ")
      variables[target] = Number(String(number)[numbersUsed])
      numbersUsed++;
    }
    else {
      const [command, a, bInput] = line.split(" ")
      const isVariable = !isNumber(bInput)
      const b = isVariable ? variables[bInput] : Number(bInput);

      if (command === "add") {
        variables[a] = variables[a] + b
      }
      else if (command === "mul") {
        variables[a] = variables[a] * b
      }
      else if (command === "div") {
        if (b === 0) console.log("Trying to divide by 0")
        variables[a] = Math.trunc(variables[a] / b)
      }
      else if (command === "mod") {
        if (variables[a] < 0 || b <= 0) console.log("Trying to mod by 0")
        else variables[a] = variables[a] % b
      }
      else if (command === "eql") {
        variables[a] = variables[a] === b ? 1 : 0
      }
      else {
        console.log(`Command ${command} not implemented`)
      }
    }
  })

  return variables
}

for (let number = 100000; number >= 0; number--) {
  const str = String(number)
  // if (str.length !== 14) continue
  if (str.includes("0")) continue

  const vars = checkNumber(number)
  console.log(number)
  if (vars["z"] === 0) {
    console.log(number)
    return
  }
}