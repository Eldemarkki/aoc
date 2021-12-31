use std::fmt;
use std::fs::read_to_string;
use std::ops::Add;

#[derive(PartialEq, Eq, Hash, Copy, Clone)]
struct Point {
    x: isize,
    y: isize,
    z: isize,
}

impl fmt::Display for Point {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "({}, {}, {})", self.x, self.y, self.z)
    }
}

impl Add for Point {
    type Output = Self;

    fn add(self, other: Self) -> Self {
        Self {
            x: self.x + other.x,
            y: self.y + other.y,
            z: self.z + other.z,
        }
    }
}

#[derive(PartialEq, Eq, Hash, Copy, Clone)]
struct Region {
    start: Point,
    end: Point,
}

impl fmt::Display for Region {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "[{}, {}]", self.start, self.end)
    }
}

#[derive(PartialEq, Eq, Hash, Copy, Clone)]
struct ActiveRegion {
    active: bool,
    region: Region,
}

impl fmt::Display for ActiveRegion {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "[{}, {}]", self.region, self.active)
    }
}

fn calculate_volume(region: Region) -> usize {
    return (region.start.x - region.end.x).abs() as usize
        * (region.start.y - region.end.y).abs() as usize
        * (region.start.z - region.end.z).abs() as usize;
}

fn contains_point(region: &Region, point: &Point) -> bool {
    return region.start.x <= point.x
        && point.x <= region.end.x
        && region.start.y <= point.y
        && point.y <= region.end.y
        && region.start.z <= point.z
        && point.z <= region.end.z;
}

fn do_intersect(a: &Region, b: &Region) -> bool {
    return contains_point(a, &b.start)
        || contains_point(a, &b.end)
        || contains_point(b, &a.start)
        || contains_point(b, &a.end);
}

fn get_intersection(a: &Region, b: &Region) -> Option<Region> {
    if !do_intersect(a, b) {
        return None;
    }

    let start = Point {
        x: a.start.x.max(b.start.x),
        y: a.start.y.max(b.start.y),
        z: a.start.z.max(b.start.z),
    };
    let end = Point {
        x: a.end.x.min(b.end.x),
        y: a.end.y.min(b.end.y),
        z: a.end.z.min(b.end.z),
    };

    let region = Region { start, end };
    return Some(region);
}

fn main() {
    let content = read_to_string("./mock.txt").expect("Could not read file at the specified path");

    let regions: Vec<ActiveRegion> = content
        .split("\n")
        .map(|line| {
            let split: Vec<&str> = line.split(" ").collect();
            let active = split[0] == "on";

            let component_split: Vec<&str> = split[1].split(",").collect();
            let xs: Vec<isize> = component_split[0][2..]
                .split("..")
                .map(|part| part.parse::<isize>().unwrap_or(0))
                .collect();
            let ys: Vec<isize> = component_split[1][2..]
                .split("..")
                .map(|part| part.parse::<isize>().unwrap_or(0))
                .collect();
            let zs: Vec<isize> = component_split[2][2..]
                .split("..")
                .map(|part| part.parse::<isize>().unwrap_or(0))
                .collect();

            let region = ActiveRegion {
                active,
                region: Region {
                    start: Point {
                        x: xs[0],
                        y: ys[0],
                        z: zs[0],
                    },
                    end: Point {
                        x: xs[1]+1,
                        y: ys[1]+1,
                        z: zs[1]+1,
                    },
                },
            };

            return region;
        })
        .collect();


    let mut result = 0;

    println!("Result {}", result);
}
