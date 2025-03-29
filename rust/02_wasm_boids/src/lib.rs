mod utils;

use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

const HEIGHT: u32 = 800;
const WIDTH: u32 = 800;

const NUM_BOIDS: u32 = 200;

const VISIBLE_RANGE: f32 = 80.0;
const PROTECTED_RANGE: f32 = 20.0;
const SEPARATION_FACTOR: f32 = 0.05;
const ALIGNMENT_FACTOR: f32 = 0.05;
const COHESION_FACTOR: f32 = 0.0005;
const TARGET_FACTOR: f32 = 8.0;
const MIN_SPEED: f32 = 3.0;
const MAX_SPEED: f32 = 6.0;

#[wasm_bindgen]
#[repr(C)]
#[derive(Copy, Clone, Debug)]
pub struct Boid {
    x: f32,
    y: f32,
    vx: f32,
    vy: f32,
}

#[wasm_bindgen]
impl Boid {
    fn get_boids_in_radius(&self, boids: &Vec<Boid>, radius: f32) -> Vec<Boid> {
        boids
            .iter()
            .cloned()
            .filter(|boid| {
                let dist_squared =
                    (boid.x - self.x) * (boid.x - self.x) + (boid.y - self.y) * (boid.y - self.y);
                dist_squared <= radius * radius
            })
            .collect()
    }

    /// We try and avoid birds that are within our protected range.
    fn separation(&self, close_boids: &Vec<Boid>) -> (f32, f32) {
        let (vx, vy) = close_boids.iter().fold((0.0, 0.0), |(vx, vy), boid| {
            (vx + (self.x - boid.x), vy + (self.y - boid.y))
        });

        (vx * SEPARATION_FACTOR, vy * SEPARATION_FACTOR)
    }

    /// We try and match the velocities of birds around us.
    fn alignment(&self, visible_boids: &Vec<Boid>) -> (f32, f32) {
        let num_neighbours = visible_boids.len();
        if num_neighbours == 0 {
            return (0.0, 0.0);
        }

        let (vx, vy) = visible_boids
            .iter()
            .fold((0.0, 0.0), |(vx, vy), boid| (vx + boid.vx, vy + boid.vy));
        let (vx, vy) = (vx / num_neighbours as f32, vy / num_neighbours as f32);

        (vx * ALIGNMENT_FACTOR, vy * ALIGNMENT_FACTOR)
    }
    /// We steer towards the center of mass of other boids within range.
    fn cohesion(&self, visible_boids: &Vec<Boid>) -> (f32, f32) {
        let num_neighbours = visible_boids.len();
        if num_neighbours == 0 {
            return (0.0, 0.0);
        }

        let (x, y) = visible_boids
            .iter()
            .fold((0.0, 0.0), |(x, y), boid| (x + boid.x, y + boid.y));
        let (x, y) = (x / num_neighbours as f32, y / num_neighbours as f32);

        (
            (x - self.x) * COHESION_FACTOR,
            (y - self.y) * COHESION_FACTOR,
        )
    }

    fn target(&self, mouse_x: f32, mouse_y: f32) -> (f32, f32) {
        let (vx, vy) = (mouse_x - self.x, mouse_y - self.y);
        let dist = (vx * vx + vy * vy).sqrt();

        // strength is a smooth function that peaks at dist=0 and is 0 almost
        // everywhere else.
        let attraction_factor = 0.005;
        let strength = 1.0 / (1.0 + attraction_factor * dist * dist);

        (
            vx / dist * strength * TARGET_FACTOR,
            vy / dist * strength * TARGET_FACTOR,
        )
    }

    /// Applies forces depending on surrounding boids, then updates its
    /// velocity and position.
    fn tick(&mut self, boids: &Vec<Boid>, target_x: f32, target_y: f32) {
        let close_birds = self.get_boids_in_radius(boids, PROTECTED_RANGE);
        let visible_birds = self.get_boids_in_radius(boids, VISIBLE_RANGE);

        let (vx1, vy1) = self.separation(&close_birds);
        let (vx2, vy2) = self.alignment(&visible_birds);
        let (vx3, vy3) = self.cohesion(&visible_birds);
        let (vx4, vy4) = self.target(target_x, target_y);

        self.vx += vx1 + vx2 + vx3 + vx4;
        self.vy += vy1 + vy2 + vy3 + vy4;

        // clamp speed
        let speed = (self.vx * self.vx + self.vy * self.vy).sqrt();
        if speed < MIN_SPEED {
            self.vx = (self.vx / speed) * MIN_SPEED;
            self.vy = (self.vy / speed) * MIN_SPEED;
        } else if speed > MAX_SPEED {
            self.vx = (self.vx / speed) * MAX_SPEED;
            self.vy = (self.vy / speed) * MAX_SPEED;
        }

        self.x = (self.x + self.vx + WIDTH as f32) % WIDTH as f32;
        self.y = (self.y + self.vy + HEIGHT as f32) % HEIGHT as f32;
    }
}

#[wasm_bindgen]
struct Controller {
    boids: Vec<Boid>,
}

#[wasm_bindgen]
impl Controller {
    pub fn new() -> Self {
        let boids = (0..NUM_BOIDS)
            .map(|x| {
                let x = (x as f32 / NUM_BOIDS as f32) * WIDTH as f32;
                let y = HEIGHT as f32 / 2.0;
                Boid {
                    x,
                    y,
                    vx: 0.0,
                    vy: 2.0,
                }
            })
            .collect();

        Controller { boids }
    }

    pub fn tick(&mut self, target_x: f32, target_y: f32) {
        let mut next = self.boids.clone();

        for boid in next.iter_mut() {
            boid.tick(&self.boids, target_x, target_y);
        }

        self.boids = next;
    }

    pub fn width(&self) -> u32 {
        WIDTH
    }

    pub fn height(&self) -> u32 {
        HEIGHT
    }

    pub fn num_boids(&self) -> u32 {
        NUM_BOIDS
    }

    pub fn boids(&self) -> *const Boid {
        self.boids.as_ptr()
    }
}
