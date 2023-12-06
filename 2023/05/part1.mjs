import { readLines } from "../../utils/input";

const lines = readLines("demo.txt");

const [seedSection, ...mapSections] = lines.join("\n").split("\n\n");

const seeds = seedSection.split(": ")[1].split(" ").map(Number);

const maps = mapSections.map((m) => {
  const [info, ...data] = m.split("\n");
  const [destination, _, source] = info.split(" ")[0].split("-");
  const pdata = data.map((row) => {
    const s = row.split(" ").map(Number);
    console.log(s);
    return {
      destination: s[0],
      source: s[1],
      length: s[2],
    };
  });

  return {
    destination,
    source,
    data: pdata,
  };
});

console.log(maps);
