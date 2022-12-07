import { readLines } from "../../utils/input";
const lines = readLines() as string[];

let tree = {};

let currentDir: string[] = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i]
  if (line.startsWith("$")) {
    const cmd = line.slice(2);
    const args = cmd.split(" ");
    if (args[0] === "cd") {
      if (args[1] === "..") {
        currentDir.pop();
      }
      else {
        if (args[1] === "/") {
          currentDir.push("");
        }
        else {
          currentDir.push(args[1]);
        }
        tree[currentDir.join("/")] = {}
      }
    }
    else if (args[0] === "ls") {
      while (lines[i + 1] && !lines[i + 1].startsWith("$")) {
        i++;
        const [size, name] = lines[i].split(" ");
        if (size === "dir") {
          tree[[...currentDir, name].join("/")] = {};
        }
        else {
          const sizeNum = parseInt(size);
          tree[[...currentDir, name].join("/")] = sizeNum;
        }
      }
    }
  }
}

const calculateSum = (obj: any, keyStart: string) => {
  let sum = 0;
  for (const key in obj) {
    if (key.startsWith(keyStart)) {
      const value = obj[key];
      if (typeof value === "number") {
        sum += value;
      }
    }
  }
  return sum;
}

const folderKeys = Object.keys(tree).filter(k => typeof tree[k] === "object");

let answer = 0;
for (const key of folderKeys) {
  const sum = calculateSum(tree, key);
  if (sum <= 100000) {
    answer += sum;
  }
}

console.log(answer);