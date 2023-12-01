import { readLines } from "../../utils/input";

const input = readLines("input.txt");

const getNumbers = (row: string) => {
  let num1 = "";
  for (let i = 0; i < row.length; i++) {
    const element = row[i];
    if (Number(element)) {
      num1 = element;
      break;
    }
  }

  let num2 = "";
  for (let i = row.length - 1; i >= 0; i--) {
    const element = row[i];
    if (Number(element)) {
      num2 = element;
      break;
    }
  }

  return Number(num1 + num2);
};

const rows = input.map(getNumbers);

const x = rows.reduce((prev, curr) => prev + curr, 0);

console.log(x);
