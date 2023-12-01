import { readLines } from "../../utils/input";

const input = readLines("input.txt");

const numbers = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];

const getNumbers = (row: string) => {
  let num1 = "";
  for (let i = 0; i < row.length; i++) {
    const element = row[i];
    const nIndex = numbers.findIndex(
      (n) => n === row.substring(i, i + n.length)
    );

    if (Number(element) || nIndex !== -1) {
      if (!isNaN(Number(element))) {
        num1 = element;
      } else {
        num1 = (nIndex + 1).toString();
      }
      break;
    }
  }

  let num2 = "";
  for (let i = row.length - 1; i >= 0; i--) {
    const element = row[i];
    const nIndex = numbers.findIndex(
      (n) => n === row.substring(i + 1 - n.length, i + 1)
    );

    if (Number(element) || nIndex !== -1) {
      if (!isNaN(Number(element))) {
        num2 = element;
      } else {
        num2 = (nIndex + 1).toString();
      }
      break;
    }
  }

  return Number(num1 + num2);
};

const rows = input.map(getNumbers);

const x = rows.reduce((prev, curr) => prev + curr, 0);

console.log(x);
