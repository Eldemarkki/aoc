const { readLines } = require("../../utils/input");

const lines = readLines();
const inputNumbers = lines[0].split(",").map(Number);

const isWinnerTable = (table) => {
  if (table.some(row => row.every(n => n.marked))) {
    return true;
  }

  for (let colIndex = 0; colIndex < 5; colIndex++) {
    if (table.every(row => row[colIndex].marked)) {
      return true;
    }
  }
  return false;
}

const markNumbers = (tables, correctNumber) => {
  return tables.map(table => table.map(row => row.map(n => ({
    number: n.number,
    marked: n.number === correctNumber || n.marked
  }))));
}

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

for (let i = 0; i < inputNumbers.length; i++) {
  const num = inputNumbers[i];
  tables = markNumbers(tables, num)
  if (tables.length !== 1) {
    tables = tables.filter(table => !isWinnerTable(table));
  }

  if (tables.length === 1 && isWinnerTable(tables[0])) {
    let sum = 0;
    tables[0].forEach(row => row.forEach(n => {
      if (!n.marked) {
        sum += n.number;
      }
    }))
    console.log(sum * num)
    return
  }
}