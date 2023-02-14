use std::collections::{HashMap, HashSet};

#[derive(Eq, Hash, PartialEq, Copy, Clone, Debug)]
struct Coordinate {
    x: usize,
    y: usize,
}

#[derive(Eq, Hash, PartialEq, Copy, Clone, Debug)]
enum PointType {
    Start,
    End,
    Normal,
}

#[derive(Eq, Hash, PartialEq, Clone, Debug)]
struct Point {
    coordinate: Coordinate,
    height: u8,
    connections: Vec<Coordinate>,
    point_type: PointType,
}

fn get_type(height: char) -> PointType {
    match height {
        'S' => PointType::Start,
        'E' => PointType::End,
        _ => PointType::Normal,
    }
}

fn get_height(height: char) -> u8 {
    match get_type(height) {
        PointType::Start => 0,
        PointType::End => 25,
        _ => (height as u8) - 97,
    }
}

static mut MIN_LENGTH: u32 = 10000;

fn traverse(
    nodes: &HashMap<Coordinate, Point>,
    start_node: Point,
    visited: &mut HashSet<Coordinate>,
    length: u32,
) {
    if start_node.point_type == PointType::End {
        unsafe {
            if length < MIN_LENGTH {
                MIN_LENGTH = length;
            }
        }
        return;
    }

    for connection in start_node.connections {
        if !&visited.contains(&connection) {
            visited.insert(start_node.coordinate);
            traverse(
                nodes,
                nodes.get(&connection).unwrap().clone(),
                visited,
                length + 1,
            );
            visited.remove(&start_node.coordinate);
        }
    }
}

fn main() {
    let mut start_coordinate = Option::<Coordinate>::None;
    let mut nodes = HashMap::<Coordinate, Point>::new();

    let raw_input = &include_str!("../../demo.txt");

    // println!("{}", raw_input);
    let lines = raw_input.lines().collect::<Vec<&str>>();

    for y in 0..lines.len() {
        let line = lines[y];
        for x in 0..line.len() {
            let mut neighbors = Vec::<Coordinate>::new();
            let current_type = get_type(line.chars().nth(x).unwrap());
            let current_height = get_height(line.chars().nth(x).unwrap());

            if current_type == PointType::Start {
                start_coordinate = Some(Coordinate { x, y });
            }

            let current_coordinate = Coordinate { x, y };

            if x > 0 && (current_height).abs_diff(get_height(line.chars().nth(x - 1).unwrap())) <= 1
            {
                neighbors.push(Coordinate { x: x - 1, y });
            }
            if x < line.len() - 1
                && (current_height).abs_diff(get_height(line.chars().nth(x + 1).unwrap())) <= 1
            {
                neighbors.push(Coordinate { x: x + 1, y });
            }
            if y > 0
                && (current_height).abs_diff(get_height(lines[y - 1].chars().nth(x).unwrap()))
                    <= 1
            {
                neighbors.push(Coordinate { x, y: y - 1 });
            }
            if y < lines.len() - 1
                && (current_height).abs_diff(get_height(lines[y + 1].chars().nth(x).unwrap()))
                    <= 1
            {
                neighbors.push(Coordinate { x, y: y + 1 });
            }

            let current_point = Point {
                coordinate: Coordinate { x, y },
                height: current_height,
                connections: neighbors,
                point_type: current_type,
            };

            nodes.insert(current_coordinate, current_point);
        }
    }

    println!("Parsing finished");

    let start_node = nodes.get(&start_coordinate.unwrap()).unwrap().clone();
    let mut visited = HashSet::<Coordinate>::new();
    traverse(&nodes, start_node, &mut visited, 0);

    unsafe {
        println!("Min length: {}", MIN_LENGTH);
    }
}
