import { readLines } from "../../utils/input";

const lines = readLines("input.txt");

const times = lines[0].split(/\s+/).slice(1).map(Number);
const distances = lines[1].split(/\s+/).slice(1).map(Number);

const races = times.map((t, i) => ({ time: t, distance: distances[i] }));

const getWays = (time: number, distance: number) => {
  let wins = 0;

  for (let holdTime = 0; holdTime <= time; holdTime++) {
    const speed = holdTime;
    const travelTime = time - holdTime;
    const travelDistance = speed * travelTime;
    if (travelDistance > distance) {
      wins++;
    }
  }
  return wins;
};

const ways = races.map((r) => getWays(r.time, r.distance));

const s = ways.reduce((a, b) => a * b, 1);
console.log(s);
