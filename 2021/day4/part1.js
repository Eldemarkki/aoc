const { readLines } = require("../../utils/input");

const lines = readLines();
const inputNumbers = lines[0].split(",").map(Number);

let tables = [];
let currentCreatingTable = []
for (let index = 2; index < lines.length; index++) {
  const line = lines[index];
  if (line == "") {
    tables.push(currentCreatingTable)
    currentCreatingTable = []
  }
  else {
    currentCreatingTable.push(line.trim().replace("  ", " ").split(" ").filter(line => line.length !== 0).map(num => ({
      number: Number(num),
      marked: false
    })))
  }
}

const markNumbers = (tables, num) => tables.map(table => table.map(row => row.map(n => ({
  number: n.number,
  marked: n.number === num || n.marked
}))));


const isWinnerTable = (table) => {
  if (table.some(row => row.every(n => n.marked))) {
    return true;
  }

  for (let colIndex = 0; colIndex < 5; colIndex++) {
    if (table.every(row => row[colIndex].marked)) {
      return true;
    }
  }
}

for (let i = 0; i < inputNumbers.length; i++) {
  const num = inputNumbers[i];
  tables = markNumbers(tables, num);

  let winnerIndex = -1;
  tables.forEach((table, i) => {
    if (isWinnerTable(table)) {
      winnerIndex = i;
    }
  });

  if (winnerIndex !== -1) {
    let sum = 0;
    tables[winnerIndex].forEach(row => row.forEach(n => {
      if (!n.marked) {
        sum += n.number;
      }
    }))

    console.log(sum * num);
    return;
  }
}