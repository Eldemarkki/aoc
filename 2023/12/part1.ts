import { readLines } from "../../utils/input";

const getNumber = (line: string) => {
  const [pattern, countsString] = line.split(" ");

  const counts = countsString.split(",").map(Number);

  const stack: string[] = [pattern];

  const generatePattern = (str: string) => {
    const p: number[] = [];
    let current = 0;

    for (let i = 0; i < str.length; i++) {
      const element = str[i];
      if (element !== "#" && current > 0) {
        p.push(current);
        current = 0;
      } else if (element === "#") {
        current++;
      }
    }

    if (current !== 0) {
      p.push(current);
    }

    return p;
  };

  const compareArrays = (arr1: number[], arr2: number[]) => {
    return arr1.length === arr2.length && arr1.every((el, i) => arr2[i] === el);
  };

  let total = 0;
  while (stack.length > 0) {
    const element = stack.shift();
    if (!element)
      throw new Error("This should never happen. Element was not defined.");

    const index = element.indexOf("?");
    if (index === -1) {
      const pattern = generatePattern(element);
      if (compareArrays(pattern, counts)) {
        total++;
      }
    } else {
      const a = element.split("");
      a[index] = ".";
      stack.push(a.join(""));

      const b = element.split("");
      b[index] = "#";
      stack.push(b.join(""));
    }
  }
  return total;
};

const lines = readLines("input.txt");

const result = lines.reduce((prev, line) => prev + getNumber(line), 0);
console.log(result);
