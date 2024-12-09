import { readLines } from "../../utils/input";

const diskMapStr = readLines("input.txt")[0]

type EmptyItem = {
    type: "empty";
    size: number;
};

type FileItem = {
    type: "file";
    id: number;
    size: number;
};

type DiskItem = EmptyItem | FileItem

let diskMap = [] as DiskItem[]

let fileIndex = 0
for (let i = 0; i < diskMapStr.length; i++) {
    const element = parseInt(diskMapStr[i])
    const isFile = i % 2 === 0
    if (isFile) {
        diskMap.push({
            id: fileIndex++,
            size: element,
            type: "file"
        })
    }
    else {
        diskMap.push({
            type: "empty",
            size: element,
        })
    }
}

const emptyCount = diskMap.reduce((sum, x) => sum + (x.type === "empty" ? x.size : 0), 0)

function findLastNonEmpty(diskmap: DiskItem[]): [FileItem, number] | undefined {
    for (let i = diskmap.length - 1; i >= 0; i--) {
        const item = diskmap[i];
        if (item.type === "file" && item.size > 0) return [item, i]
    }
    return undefined
}


function insert<T>(arr: T[], index: number, newItem: T) {
    return [
        ...arr.slice(0, index),
        newItem,
        ...arr.slice(index)
    ]
}

for (let i = 0; i < emptyCount; i++) {
    const firstEmpty = diskMap.findIndex(x => x.type === "empty" && x.size > 0)
    const l = findLastNonEmpty(diskMap)

    if (l) {
        const [lastNonEmpty, lastNonEmptyIndex] = l
        if (lastNonEmptyIndex >= firstEmpty) {
            const empty = diskMap[firstEmpty]
            empty.size--

            diskMap = insert(diskMap, firstEmpty, {
                id: lastNonEmpty.id,
                size: 1,
                type: "file"
            })

            lastNonEmpty.size--

            diskMap.push({
                type: "empty",
                size: 1
            })
        }
    }
}

function checksum(diskmap: DiskItem[]) {
    let result = 0
    let position = 0
    for (let i = 0; i < diskmap.length; i++) {
        const element = diskmap[i];
        if (element.type === "file") {
            for (let j = 0; j < element.size; j++) {
                result += position * element.id
                position++
            }
        }
    }
    return result
}

console.log(checksum(diskMap))