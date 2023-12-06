import { readLines } from "../../utils/input";

const lines = readLines("demo2.txt");

const [seedSection, ...mapSections] = lines.join("\n").split("\n\n");

const seeds = seedSection.split(": ")[1].split(" ").map(Number);

const maps = mapSections.map((m) => {
  const [info, ...data] = m.split("\n");
  const [source, _, destination] = info.split(" ")[0].split("-");
  const pdata = data.map((row) => {
    const s = row.split(" ").map(Number);
    return {
      destination: s[0],
      source: s[1],
      size: s[2],
    };
  });

  pdata.sort((a, b) => a.source - b.source);
  return {
    destination,
    source,
    data: pdata,
  };
});

const removeRange = (
  range: [number, number],
  remove: [number, number]
): [number, number][] | undefined => {
  if (range[0] > range[1]) {
    throw new Error("Range is invalid");
  }

  if (remove[0] > remove[1]) {
    throw new Error("Range to remove is invalid");
  }

  if (remove[1] < range[0]) {
    return undefined;
  }

  if (range[1] < remove[0]) {
    return undefined;
  }

  if (range[0] < remove[0] && remove[1] < range[1]) {
    //   AAAAAAAA
    //      DD
    return [
      [range[0], remove[0] - 1],
      [remove[1] + 1, range[1]],
    ];
  } else if (range[0] === remove[0] && remove[1] < range[1]) {
    //   AAAAAAAA
    //   DDDD
    return [[remove[1] + 1, range[1]]];
  } else if (range[0] < remove[0] && remove[1] === range[1]) {
    //   AAAAAAAA
    //      DDDDD
    return [[range[0], remove[0] - 1]];
  } else if (remove[0] < range[0] && remove[1] < range[1]) {
    //   AAAAAAAA
    // DDDDD
    return [[remove[1] + 1, range[1]]];
  } else if (range[0] < remove[0] && range[1] < remove[1]) {
    //   AAAAAAAA
    //        DDDDD
    return [[range[0], remove[0] - 1]];
  } else {
    //   AAAAAAAA
    // DDDDDDDDDDDD
    return [];
  }
};

const addRange = (
  range: [number, number],
  add: [number, number]
): [number, number][] => {
  if (range[0] > range[1]) {
    throw new Error("Range is invalid");
  }

  if (add[0] > add[1]) {
    throw new Error("Range to add is invalid");
  }

  if (add[1] < range[0]) {
    //         AAAAAAA
    // AAAAAA
    return [add, range];
  }

  if (range[1] < add[0]) {
    // AAAAAA
    //         AAAAAAA
    return [range, add];
  }

  if (range[0] <= add[0] && add[1] <= range[1]) {
    //   AAAAAAAA
    //      AA
    return [range];
  } else if (add[0] < range[0] && add[1] < range[1]) {
    //   AAAAAAAA
    // AAAAA
    return [[add[0], range[1]]];
  } else if (range[0] < add[0] && range[1] < add[1]) {
    //   AAAAAAAA
    //        DDDDD
    return [[range[0], add[1]]];
  } else {
    //   AAAAAAAA
    // AAAAAAAAAAAA
    return [add];
  }
};

const applyMap = (
  range: [number, number],
  map: {
    destination: number;
    source: number;
    size: number;
  }
) => {
  const size = map.size;
  let newRanges: [number, number][] | undefined = undefined;

  if (map.source <= range[0] && range[0] < map.source + map.size) {
    newRanges = removeRange(range, [map.source, map.source + size - 1]);
  } else {
    return undefined;
  }

  if (!newRanges) return [range];

  let withAdditions: [number, number][] = [];

  const dest = map.destination + (range[0] - map.source);
  const howManyFit = map.destination + map.size - dest;
  const howManyExist = range[1] - range[0] + 1;
  const destinationRange = [
    dest,
    dest + Math.min(howManyFit, howManyExist) - 1,
  ] satisfies [number, number];

  return destinationRange;
  // if (newRanges.length === 0) {
  //   withAdditions = [destinationRange];
  // } else {
  //   withAdditions = newRanges.flatMap((r) => {
  //     return addRange(r, destinationRange);
  //   });
  // }

  // newRanges.push(...withAdditions);

  // const uniqueRanges = newRanges.filter(
  //   (n, i, data) => data.findIndex((r) => r[0] === n[0] && r[1] === n[1]) === i
  // );
  // uniqueRanges.sort((a, b) => a[0] - b[0]);

  // return uniqueRanges;
};

let ranges: [number, number][] = [];
for (let i = 0; i < seeds.length; i += 2) {
  ranges.push([seeds[i], seeds[i] + seeds[i + 1] - 1]);
}

const simulate = (ranges: [number, number][]) => {
  let newRangeConstructed: [number, number][] = [...ranges];

  for (const phase of maps) {
    let seedRangeConstructed: [number, number][] = [];
    console.log("starting with", newRangeConstructed);
    for (const seedRange of newRangeConstructed) {
      for (const map of phase.data) {
        const a = applyMap(seedRange, map);

        if (a) {
          seedRangeConstructed.push(...a);
        } else {
          seedRangeConstructed.push();
        }
      }
    }

    newRangeConstructed = [
      ...(seedRangeConstructed.length
        ? seedRangeConstructed
        : newRangeConstructed),
    ].filter(
      (n, i, data) =>
        data.findIndex((r) => r[0] === n[0] && r[1] === n[1]) === i
    );

    console.log("ended with", newRangeConstructed);
    console.log("phase " + phase.source + "-to-" + phase.destination + " done");
    console.log("-------------");
  }

  const uniqueRanges = newRangeConstructed.filter(
    (n, i, data) => data.findIndex((r) => r[0] === n[0] && r[1] === n[1]) === i
  );
  uniqueRanges.sort((a, b) => a[0] - b[0]);
  return uniqueRanges;
};

const newRanges = simulate(ranges);
console.log(newRanges);
