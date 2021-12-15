use std::collections::HashMap;
use std::fs::read_to_string;
use std::ops::{Add, Sub};

#[derive(PartialEq, Eq, Hash, Copy, Clone)]
struct Point {
    x: usize,
    y: usize,
}

impl Add for Point {
    type Output = Self;

    fn add(self, other: Self) -> Self {
        Self {
            x: self.x + other.x,
            y: self.y + other.y,
        }
    }
}

impl Sub for Point {
    type Output = Self;

    fn sub(self, other: Self) -> Self {
        Self {
            x: self.x - other.x,
            y: self.y - other.y,
        }
    }
}

#[derive(PartialEq, Eq, Hash, Copy, Clone)]
struct ValueAndPosition {
    value: usize,
    position: Point,
}

fn manhattan_distance(a: (isize, isize), b: (isize, isize)) -> usize {
    // a.0.abs_diff(b.0) + a.1.abs_diff(b.1)
    let res = (a.0 - b.0).abs() + (a.1 - b.1).abs();
    return res as usize;
}

fn are_same_point(a: Point, b: Point) -> bool {
    return a.x == b.x && a.y == b.y;
}

fn calculate_prev(
    graph: &Vec<Point>,
    source: Point,
    calculate_length: &dyn Fn(Point) -> usize,
) -> HashMap<Point, Option<Point>> {
    let directions: Vec<(isize, isize)> = vec![(1, 0), (-1, 0), (0, 1), (0, -1)];
    let mut q = graph.clone();
    let mut dist = HashMap::<Point, usize>::new();
    let mut prev = HashMap::<Point, Option<Point>>::new();
    for vertex in &q {
        dist.insert(vertex.to_owned(), usize::MAX);
        prev.insert(vertex.to_owned(), None);
    }
    dist.insert(source, 0);
    while !&q.is_empty() {
        let mut u_option: Option<Point> = None;
        let mut u_index = 0; // Or isize = -1
        for qi in 0..(q.len()) {
            let element = &q[qi];
            let u_value: &usize = match u_option {
                Some(v) => dist.get(&v).unwrap(),
                None => &usize::MAX,
            };
            let element_value: &usize = match dist.get(element) {
                Some(v) => v,
                None => &usize::MAX,
            };
            if element_value < u_value {
                u_option = Some(element.to_owned());
                u_index = qi;
            }
        }

        q.remove(u_index);
        let u = u_option.unwrap();
        for dir in &directions {
            let v_i32 = (u.x as isize + dir.0, u.y as isize + dir.1);
            if v_i32.0 < 0 || v_i32.1 < 0 {
                continue;
            }

            let v = Point {
                x: v_i32.0 as usize,
                y: v_i32.1 as usize,
            };

            if q.contains(&v) {
                let alt = dist.get(&u).unwrap() + calculate_length(v);
                if alt < dist.get(&v).unwrap().to_owned() {
                    dist.insert(v, alt);
                    prev.insert(v, Some(u));
                }
            }
        }
        println!("{}", q.len());
    }

    return prev;
}

fn get_path(prev_map: HashMap<Point, Option<Point>>, source: Point, target: Point) -> Vec<Point> {
    let mut s = Vec::new();
    let mut u = target;
    if prev_map.contains_key(&u) || are_same_point(u, source) {
        while prev_map.contains_key(&u) {
            s.push(u);
            let x = prev_map.get(&u).unwrap();
            if u != source {
                u = x.to_owned().unwrap();
            } else {
                break;
            }
        }
    }
    s.reverse();
    return s;
}

fn global_point_to_first_tile(point: Point, data: Vec<Vec<ValueAndPosition>>) -> Point {
    Point {
        x: point.x % data[0].len(),
        y: point.y % data.len(),
    }
}

fn get_risk_in_tile(risk: usize, tile_position: Point) -> usize {
    let d = manhattan_distance((0, 0), (tile_position.x as isize, tile_position.y as isize));
    let new_risk = risk + d;
    if new_risk <= 9 {
        return new_risk;
    }
    return new_risk % 9;
}

fn main() {
    let content = read_to_string("./input.txt").expect("Could not read file at the specified path");
    let lines = content.split("\n");
    let mut column_index_first = 0;
    let mut row_index_first = 0;
    let data: Vec<Vec<ValueAndPosition>> = lines
        .map(|line| {
            let y = row_index_first;
            row_index_first += 1;

            // TODO: Init length
            let mut new_line = Vec::new();
            for letter in line.chars() {
                let x = column_index_first;
                column_index_first += 1;
                new_line.push(ValueAndPosition {
                    value: match letter.to_digit(10) {
                        None => 0,
                        Some(i) => i as usize,
                    },
                    position: Point { x, y },
                })
            }
            new_line
        })
        .collect();

    let tile_count = 5;
    let mut fullmap: Vec<Vec<ValueAndPosition>> = Vec::new();
    for tile_y in 0..tile_count {
        let mut row_index = 0;
        fullmap.extend(data.iter().map(|line| {
            let mut new_line: Vec<ValueAndPosition> = Vec::new();
            for tile_x in 0..tile_count {
                let mut column_index = 0;
                let it = line.into_iter();
                // it.map
                new_line.extend(it.map(|v| {
                    let risk = get_risk_in_tile(
                        v.value,
                        Point {
                            x: tile_x,
                            y: tile_y,
                        },
                    );
                    let x = tile_x * data[0].len() + column_index;
                    column_index += 1;
                    let y = tile_y * data.len() + row_index;
                    return ValueAndPosition {
                        value: risk,
                        position: Point { x, y },
                    };
                }))
            }
            row_index += 1;
            return new_line;
        }))
    }

    let x_length = data[0].len();
    let y_length = data.len();
    let positions: Vec<Point> = fullmap.into_iter().flatten().map(|v| v.position).collect();
    let prev = calculate_prev(&positions, Point { x: 0, y: 0 }, &|point| {
        let tile_x = (point.x as f32 / data[0].len() as f32).floor() as usize;
        let tile_y = (point.y as f32 / data.len() as f32).floor() as usize;
        let risk_in_first_tile =
            &data[point.y % y_length][(point.x % x_length) as usize];
        return get_risk_in_tile(
            risk_in_first_tile.value,
            Point {
                x: tile_x,
                y: tile_y,
            },
        );
    });

    let target_pos = Point {
        x: x_length * tile_count - 1,
        y: y_length * tile_count - 1,
    };

    let path = get_path(prev, Point { x: 0, y: 0 }, target_pos);
    let mut total_risk = 0;
    for i in 1..path.len() {
        let point = path[i];
        let tile_x = (point.x as f32 / x_length as f32).floor() as usize;
        let tile_y = (point.y as f32 / y_length as f32).floor() as usize;
        let p = global_point_to_first_tile(point, data.to_owned());
        total_risk += get_risk_in_tile(
            data[p.y as usize][p.x as usize].value,
            Point {
                x: tile_x,
                y: tile_y,
            },
        )
    }

    println!("{}", total_risk);
}
