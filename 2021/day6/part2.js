const { readLines } = require("../../utils/input")

const initialState = readLines()[0].split(",").map(Number)

// Key is the age, value is how many lanternfish of that age there are
let ageMap = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 }
initialState.forEach(n => ageMap[n] += 1)

const simulateCycle = (state) => {
  let newState = {}

  newState[0] = state[1]
  newState[1] = state[2]
  newState[2] = state[3]
  newState[3] = state[4]
  newState[4] = state[5]
  newState[5] = state[6]
  newState[6] = state[7]
  newState[7] = state[8]
  newState[8] = state[0]

  newState[6] += state[0]

  return newState
}

let state = { ...ageMap }
for (let i = 0; i < 256; i++) {
  state = simulateCycle(state)
}

const sum = Object.values(state).reduce((p, c) => p + c, 0);
console.log(sum)