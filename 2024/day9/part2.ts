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

const fileCount = diskMap.filter(x => x.type === "file").length

function swap<T>(arr: T[], a: number, b: number) {
    const temp = arr[b]
    arr[b] = arr[a]
    arr[a] = temp
}

function insert<T>(arr: T[], index: number, newItem: T) {
    return [
        ...arr.slice(0, index),
        newItem,
        ...arr.slice(index)
    ]
}


for (let fileId = fileCount - 1; fileId >= 0; fileId--) {
    const fileIndex = diskMap.findIndex(x => x.type === "file" && x.id === fileId)
    const file = diskMap[fileIndex] as FileItem

    for (let i = 0; i < fileIndex; i++) {
        const element = diskMap[i];
        if (element.type === "empty") {
            if (element.size >= file.size) {
                swap(diskMap, fileIndex, i)
                const sizeDiff = element.size - file.size
                if (sizeDiff > 0) {
                    diskMap = insert(diskMap, i + 1, {
                        type: "empty",
                        size: sizeDiff
                    })
                    element.size -= sizeDiff
                }
                break
            }
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
        else {
            position += element.size
        }
    }
    return result
}

console.log(checksum(diskMap))