import { readLines } from "../../utils/input";

const lines = readLines("input.txt");

const [seedSection, ...mapSections] = lines.join("\n").split("\n\n");

const seeds = seedSection.split(": ")[1].split(" ").map(Number);

const maps = mapSections.map((m) => {
  const [info, ...data] = m.split("\n");
  const [destination, _, source] = info.split(" ")[0].split("-");
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

const processSeed = (seed: number) => {
  let value = seed;
  for (const map of maps) {
    const s = map.data.find(
      (m) => m.source <= value && value < m.source + m.size
    );
    if (s) {
      const offset = value - s.source;
      const newValue = s.destination + offset;
      value = newValue;
    }
  }
  return value;
};

const locations = seeds.map(processSeed);
console.log(Math.min(...locations));
