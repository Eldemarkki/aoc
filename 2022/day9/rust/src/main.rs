#[derive(PartialEq, Clone, Copy)]
enum Direction {
    Left,
    Right,
    Up,
    Down,
}

#[derive(Clone, Copy, PartialEq, Debug)]
struct Point {
    x: i32,
    y: i32,
}

fn simulate_step(head: Point, tail: Point, direction: Direction) -> (Point, Point) {
    let sign = match direction {
        Direction::Left => -1,
        Direction::Right => 1,
        Direction::Up => 1,
        Direction::Down => -1,
    };

    let new_head = match direction {
        Direction::Left | Direction::Right => Point {
            x: head.x + sign,
            y: head.y,
        },
        Direction::Up | Direction::Down => Point {
            x: head.x,
            y: head.y + sign,
        },
    };

    if tail.x == new_head.x && tail.y != new_head.y {
        let diff = (new_head.y - tail.y).abs();
        return (
            new_head,
            Point {
                x: tail.x,
                y: tail.y + (if diff >= 2 { sign } else { 0 }),
            },
        );
    } else if tail.y == new_head.y && tail.x != new_head.x {
        let diff = (new_head.x - tail.x).abs();
        return (
            new_head,
            Point {
                x: tail.x + (if diff >= 2 { sign } else { 0 }),
                y: tail.y,
            },
        );
    } else if tail.x != new_head.x && tail.y != new_head.y {

        let diff_x = head.x - tail.x;
        let diff_y = head.y - tail.y;

        if diff_x.abs() == 2 && diff_y.abs() == 1 {
            return (new_head, Point{
                x: tail.x,
                y: tail.y + sign,
            });
        }
        else if diff_x.abs() == 1 && diff_y.abs() == 2 {

            return (new_head, Point{
                x: tail.x + sign,
                y: tail.y,
            });
        }

        let diff = (new_head.x - tail.x).abs().max((new_head.y - tail.y).abs());

        return (
            new_head,
            Point {
                x: tail.x + (if diff >= 2 { sign } else { 0 }),
                y: tail.y + (if diff >= 2 { sign } else { 0 }),
            },
        );
    }

    return (new_head, tail);
}

#[test]
fn test_simulate_step_1() {
    let head = Point { x: 0, y: 0 };
    let tail = Point { x: 0, y: 0 };
    let direction = Direction::Right;

    let (new_head, new_tail) = simulate_step(head, tail, direction);

    assert_eq!(new_head, Point { x: 1, y: 0 });
    assert_eq!(new_tail, Point { x: 0, y: 0 });
}

#[test]
fn test_simulate_step_2() {
    let head = Point { x: 1, y: 0 };
    let tail = Point { x: 0, y: 0 };
    let direction = Direction::Right;

    let (new_head, new_tail) = simulate_step(head, tail, direction);

    assert_eq!(new_head, Point { x: 2, y: 0 });
    assert_eq!(new_tail, Point { x: 1, y: 0 });
}

#[test]
fn test_simulate_step_3() {
    let head = Point { x: 1, y: 1 };
    let tail = Point { x: 0, y: 0 };
    let direction = Direction::Right;

    let (new_head, new_tail) = simulate_step(head, tail, direction);

    assert_eq!(new_head, Point { x: 2, y: 1 });
    assert_eq!(new_tail, Point { x: 1, y: 1 });
}

#[test]
fn test_simulate_step_4() {
    let head = Point { x: 1, y: 1 };
    let tail = Point { x: 0, y: 0 };
    let direction = Direction::Up;

    let (new_head, new_tail) = simulate_step(head, tail, direction);

    assert_eq!(new_head, Point { x: 1, y: 2 });
    assert_eq!(new_tail, Point { x: 1, y: 1 });
}

#[test]
fn test_simulate_step_5() {
    let head = Point { x: 1, y: 1 };
    let tail = Point { x: 0, y: 0 };
    let direction = Direction::Down;

    let (new_head, new_tail) = simulate_step(head, tail, direction);

    assert_eq!(new_head, Point { x: 1, y: 0 });
    assert_eq!(new_tail, Point { x: 0, y: 0 });
}

#[test]
fn test_simulate_step_6() {
    let head = Point { x: 4, y: 0 };
    let tail = Point { x: 3, y: 0 };
    let direction = Direction::Up;

    let (new_head, new_tail) = simulate_step(head, tail, direction);

    assert_eq!(new_head, Point { x: 4, y: 1 });
    assert_eq!(new_tail, Point { x: 3, y: 0 });
}

fn move_rope(old_rope: &Vec<Point>, direction: Direction) -> Vec<Point> {
    let mut rope = old_rope.to_owned();

    for line_index in 0..rope.len() - 1 {
        println!("{:?}, {:?},      {:?}", rope[line_index], rope[line_index+1], rope);

        let (new_head, new_tail) = simulate_step(rope[line_index], rope[line_index + 1], direction);
        if line_index == 0 {
            rope[line_index] = new_head;
        }
        rope[line_index + 1] = new_tail;
    }

    return rope;
}

#[test]
fn test_move_rope_1() {
    let rope = vec![Point { x: 2, y: 0 }, Point { x: 1, y: 0 }];

    let direction = Direction::Right;

    let new_rope = move_rope(&rope, direction);

    assert_eq!(new_rope, vec![Point { x: 3, y: 0 }, Point { x: 2, y: 0 },]);
}

#[test]
fn test_move_rope_2() {
    let rope = vec![Point { x: 2, y: 0 }, Point { x: 2, y: 0 }];

    let direction = Direction::Right;

    let new_rope = move_rope(&rope, direction);

    assert_eq!(new_rope, vec![Point { x: 3, y: 0 }, Point { x: 2, y: 0 },]);
}

#[test]
fn test_move_rope_3() {
    let rope = vec![Point { x: 3, y: 1 }, Point { x: 2, y: 0 }];

    let direction = Direction::Right;

    let new_rope = move_rope(&rope, direction);

    assert_eq!(new_rope, vec![Point { x: 4, y: 1 }, Point { x: 3, y: 1 },]);
}

#[test]
fn test_move_rope_4() {
    let rope = vec![
        Point { x: 2, y: 0 },
        Point { x: 1, y: 0 },
        Point { x: 0, y: 0 },
        Point { x: 0, y: 0 },
        Point { x: 0, y: 0 },
        Point { x: 0, y: 0 },
        Point { x: 0, y: 0 },
    ];

    let direction = Direction::Right;

    let new_rope = move_rope(&rope, direction);

    assert_eq!(
        new_rope,
        vec![
            Point { x: 3, y: 0 },
            Point { x: 2, y: 0 },
            Point { x: 1, y: 0 },
            Point { x: 0, y: 0 },
            Point { x: 0, y: 0 },
            Point { x: 0, y: 0 },
            Point { x: 0, y: 0 },
        ]
    );
}

#[test]
fn test_move_rope_5() {
    let rope = vec![
        Point { x: 4, y: 0 },
        Point { x: 3, y: 0 },
        Point { x: 2, y: 0 },
        Point { x: 1, y: 0 },
        Point { x: 0, y: 0 },
        Point { x: 0, y: 0 },
        Point { x: 0, y: 0 },
    ];

    let direction = Direction::Up;

    let new_rope = move_rope(&rope, direction);

    assert_eq!(
        new_rope,
        vec![
            Point { x: 4, y: 1 },
            Point { x: 3, y: 0 },
            Point { x: 2, y: 0 },
            Point { x: 1, y: 0 },
            Point { x: 0, y: 0 },
            Point { x: 0, y: 0 },
            Point { x: 0, y: 0 },
        ]
    );
}

#[test]
fn test_move_rope_6() {
    let rope = vec![
        Point { x: 4, y: 1 },
        Point { x: 3, y: 0 },
        Point { x: 2, y: 0 },
        Point { x: 1, y: 0 },
        Point { x: 0, y: 0 },
        Point { x: 0, y: 0 },
        Point { x: 0, y: 0 },
    ];

    let direction = Direction::Up;

    let new_rope = move_rope(&rope, direction);

    assert_eq!(
        new_rope,
        vec![
            Point { x: 4, y: 2 },
            Point { x: 4, y: 1 },
            Point { x: 3, y: 1 },
            Point { x: 2, y: 1 },
            Point { x: 1, y: 1 },
            Point { x: 0, y: 0 },
            Point { x: 0, y: 0 },
        ]
    );
}

fn main() {
    println!("Hello, world!");
}
