import { readLines } from "../../utils/input";
const lines = readLines() as string[];

type Monkey = {
  id: number;
  startingItems: number[];
  operation: (old: number) => number;
  test: {
    divisibleBy: number;
    trueMonkey: number;
    falseMonkey: number;
  }
}

const monkeys: Monkey[] = [];

const monkeyCount = (lines.length + 1) / 7;
for (let i = 0; i < monkeyCount; i++) {
  const monkeyLines = lines.slice(i * 7, (i + 1) * 7 - 1);

  // console.log(monkeyLines);

  let operationType = monkeyLines[2][23];
  let operationNumber = monkeyLines[2].slice(25);

  const trueParts = monkeyLines[4].split(' ');
  const trueMonkey = Number(trueParts[trueParts.length - 1]);

  const falseParts = monkeyLines[5].split(' ');
  const falseMonkey = Number(falseParts[falseParts.length - 1]);

  const monkey: Monkey = {
    id: Number(monkeyLines[0].slice(7).replace(':', '')),
    startingItems: monkeyLines[1].slice(18).split(', ').map(Number),
    operation: (old: number) => {
      const operationNumberActual = operationNumber === "old" ? old : Number(operationNumber);
      if (operationType === '+') {
        return old + operationNumberActual;
      } else {
        return old * operationNumberActual;
      }
    },
    test: {
      // @ts-ignore
      divisibleBy: Number(monkeyLines[3].split(' ')[5]),
      trueMonkey,
      falseMonkey
    }
  }

  monkeys.push(monkey);
}

for (const monkey of monkeys) {
  console.log(monkey);
}

let holdingCounts: Record<number, number> = {};
for (let cycle = 0; cycle < 20; cycle++) {
  for (let holdingMonkey = 0; holdingMonkey < monkeys.length; holdingMonkey++) {
    const monkey = monkeys[holdingMonkey];
    // console.log("Monkey " + monkey.id + ":")

    const startingItems = monkey.startingItems;
    holdingCounts[holdingMonkey] = (holdingCounts[holdingMonkey] || 0) + startingItems.length;
    let length = startingItems.length;
    for (let i = 0; i < length; i++) {
      let itemWorryLevel = startingItems.shift()!;
      // console.log("  Monkey inspects an item with a worry level of " + itemWorryLevel + ".")
      let newWorryLevel = Math.floor(monkey.operation(itemWorryLevel) / 3);
      // console.log("    Worry level increases by " + (newWorryLevel - itemWorryLevel) + " to " + newWorryLevel + ".");
      // console.log("    Monkey gets bored with item. Worry level is divided by 3 to " + newWorryLevel + ".")
      const isDivisible = newWorryLevel % monkey.test.divisibleBy === 0;
      // console.log(`    Current worry level is ${isDivisible ? '' : 'not '}divisible by ${monkey.test.divisibleBy}.`)
      let throwMonkey = isDivisible ? monkey.test.trueMonkey : monkey.test.falseMonkey;
      // console.log(`    Item with worry level ${newWorryLevel} is thrown to monkey ${throwMonkey}.`)
      monkeys[throwMonkey].startingItems.push(newWorryLevel);
    }
  }

  // console.log("After round " + (cycle + 1) + ":");
  // for (const monkey of monkeys) {
  //   console.log("Monkey " + monkey.id + ": " + monkey.startingItems.join(', '))
  // }
}

let vals = Object.values(holdingCounts).map(Number).sort((a, b) => b - a);
console.log(vals)
console.log(vals[0] * vals[1]);