const { readLines } = require("../../utils/input");

const lines = readLines("input.txt");

let cucumbers = []
const height = lines.length;
const width = lines[0].length;

lines.forEach((line, yPos) => {
	Array.from(line).forEach((letter, xPos) => {
		if (letter === "v") {
			cucumbers.push({
				xPos, yPos, direction: "down"
			})
		}
		else if (letter === ">") {
			cucumbers.push({
				xPos, yPos, direction: "right"
			})
		}
	})
})

const isSpotEmpty = (cucumbers, x, y) => {
	return !cucumbers.some(c => c.xPos === x && c.yPos === y)
}

const runEastFacing = cucumbers => {
	const newCucumbers = []
	cucumbers.forEach(c => {
		if (c.direction === "right") {
			const newXPos = (c.xPos + 1) % width;
			const canMove = isSpotEmpty(cucumbers, newXPos, c.yPos);
			if (canMove) {
				newCucumbers.push({
					...c,
					xPos: newXPos
				})
			}
			else {
				newCucumbers.push(c)
			}
		}
		else {
			newCucumbers.push(c)
		}
	})
	return newCucumbers
}

const runSouthFacing = cucumbers => {
	const newCucumbers = []
	cucumbers.forEach(c => {
		if (c.direction === "down") {
			const newYPos = (c.yPos + 1) % height;
			const canMove = isSpotEmpty(cucumbers, c.xPos, newYPos);
			if (canMove) {
				newCucumbers.push({
					...c,
					yPos: newYPos
				})
			}
			else {
				newCucumbers.push(c)
			}
		}
		else {
			newCucumbers.push(c)
		}
	})
	return newCucumbers
}

const runCycle = cucumbers => {
	let newCucumbers = runEastFacing(cucumbers)
	newCucumbers = runSouthFacing(newCucumbers);
	return newCucumbers;
}

const printCucumbers = cucumbers => {
	for (let y = 0; y < height; y++) {
		let str = "";
		for (let x = 0; x < width; x++) {
			if (isSpotEmpty(cucumbers, x, y)) {
				str += "."
			} else {
				str += cucumbers.filter(c => c.xPos === x && c.yPos === y)[0].direction === "right" ? ">" : "v"
			}
		}
		console.log(str)
	}
}

let hasChanged = true
let count = 0;
while (hasChanged) {
	const original = JSON.stringify(cucumbers)
	cucumbers = runCycle(cucumbers);
	// printCucumbers(cucumbers)
	hasChanged = JSON.stringify(cucumbers) !== original
	count++;
	console.log(count)
}
