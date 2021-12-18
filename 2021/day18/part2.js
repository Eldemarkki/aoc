const { readLines } = require("../../utils/input");

const isNumber = x => !isNaN(Number(x));

const findFirstNumberLeftOf = (tree, leftOf) => {
  for (let i = leftOf - 1; i >= 0; i--) {
    if (isNumber(tree[i])) {
      let built = tree[i]
      let index = i;
      for (let j = i - 1; j >= 0; j--) {
        if (isNumber(tree[j])) {
          built = tree[j] + built
          index--;
        } else {
          break;
        }
      }
      return { number: Number(built), index, length: built.length }
    }
  }
  return { number: 0, index: -1, length: 1 }
}

const findFirstNumberRightOf = (tree, rightOf) => {
  for (let i = rightOf + 1; i < tree.length; i++) {
    if (isNumber(tree[i])) {
      let built = tree[i]
      for (let j = i + 1; j < tree.length; j++) {
        if (isNumber(tree[j])) {
          built += tree[j]
        }
        else {
          break;
        }
      }
      return { number: Number(built), index: i, length: built.length }

    }
  }
  return { number: 0, index: -1, length: 1 }
}

const replaceChars = (str, i, newChar, length = 1) => {
  return str.slice(0, i) + newChar + str.slice(i + length)
}

const splitSingleNumber = x => {
  return [Math.floor(x / 2), Math.ceil(x / 2)]
}

const extractFollowingNumber = x => {
  let res = ""
  for (let i = 0; i < x.length; i++) {
    const letter = x[i];
    if (isNumber(letter)) {
      res += letter;
    }
    else {
      break;
    }
  }
  if (res.length === 0) {
    return {
      number: 0,
      length: 0
    }
  }
  else {
    return {
      number: Number(res),
      length: res.length
    }
  }
}

const explodePairs = (tree) => {
  let depth = 0;
  for (let i = 0; i < tree.length; i++) {
    if (tree[i] === "[") depth++;
    else if (tree[i] === "]") depth--;
    else {
      if (depth <= 4) continue;

      const r = /([0-9]{1,2}),([0-9]{1,2})/g
      const slice = tree.slice(i, i + 5);

      if (tree[i - 1] === "[" && r.test(slice)) {
        const firstExplodingNumber = extractFollowingNumber(slice.split(",")[0])
        const ai = i;

        const secondExplodingNumber = extractFollowingNumber(slice.split(",")[1])
        let bi = i + firstExplodingNumber.length + 1

        const numberIncreasingLeft = findFirstNumberLeftOf(tree, ai)
        let leftNewLength = 1;
        if (numberIncreasingLeft.index !== -1) {
          const newValue = String(numberIncreasingLeft.number + firstExplodingNumber.number)
          const bl = tree.length

          tree = replaceChars(tree, numberIncreasingLeft.index, newValue, numberIncreasingLeft.length)
          bi += tree.length - bl

          leftNewLength = newValue.length
        }


        const numberIncreasingRight = findFirstNumberRightOf(tree, bi + leftNewLength)
        let rightNewLength = 1;
        if (numberIncreasingRight.index !== -1) {
          const newValue = String(numberIncreasingRight.number + secondExplodingNumber.number)
          tree = replaceChars(tree, numberIncreasingRight.index, newValue, numberIncreasingRight.length)

          rightNewLength = newValue.length
        }

        let leftNewLetters = leftNewLength - numberIncreasingLeft.length
        let newTree = tree.slice(0, i + leftNewLetters - 1)
        newTree += "0"

        const endStart = bi + secondExplodingNumber.length + 1
        const end = tree.slice(endStart)
        newTree += end

        return newTree
      }
    }
  }
  
  return tree
}

const splitNumbersOnce = tree => {
  return tree.replace(/([0-9][0-9])/, (substr, ...args) => {
    const pair = splitSingleNumber(Number(substr))
    return `[${pair[0]},${pair[1]}]`
  })
}

const add = (a, b) => `[${a},${b}]`;

const containsDoubleDigitNumbers = input => /([0-9][0-9])/.test(input);
const getDepth = array => Array.isArray(array) ? Math.max(...array.map(getDepth)) + 1 : 0;

const calculate = input => {
  while (true) {
    const shouldExplode = getDepth(JSON.parse(input)) > 4;
    const shouldSplit = containsDoubleDigitNumbers(input);

    if (shouldExplode) {
      input = explodePairs(input)
      continue;
    }
    if (shouldSplit) {
      input = splitNumbersOnce(input)
      continue;
    }

    if (!shouldExplode && !shouldSplit) {
      return input
    }
  }
}


const calculateMagnitude = tree => {
  if (!Array.isArray(tree)) return tree;

  const isLeaf = !Array.isArray(tree[0]) && !Array.isArray(tree[1])
  if (isLeaf) return 3 * tree[0] + 2 * tree[1]
  else return 3 * calculateMagnitude(tree[0]) + 2 * calculateMagnitude(tree[1])
}

const lines = readLines("input.txt")
const magnitudes = []
for (let i = 0; i < lines.length; i++) {
  for (let j = 0; j < lines.length; j++) {
    if (i === j) continue;
    const tree = calculate(add(lines[i], lines[j]))
    const mag = calculateMagnitude(JSON.parse(tree))
    magnitudes.push(mag)
  }
}

console.log(Math.max(...magnitudes))
