const { readLines } = require("../../utils/input");

const initialState = readLines()[0].split(",").map(Number);

const simulateCycle = (state) => {
  let newCount = 0;
  const newState = state.map(x => {
    if (x == 0) {
      newCount++;
      return 6;
    }

    return x - 1;
  })

  return [
    ...newState,
    ...Array(newCount).fill(8)
  ];
}

let state = [...initialState];
for (let i = 0; i < 80; i++) {
  state = simulateCycle(state);
}
console.log(state.length)