import p5 from "p5";

type Options = {
  radius: number;
  tries: number;
  width: number;
  height: number;
  skipPoint?: (point: p5.Vector) => boolean;
};

type Result = {
  points: p5.Vector[];
  grid: PointsGrid;
  extra: { cols: number; rows: number };
};

export type PointsGrid = (undefined | null | p5.Vector)[];

export default function poissonDisk(
  p: p5,
  { radius, tries, width, height, skipPoint = () => false }: Options
): Result {
  const active: p5.Vector[] = [];
  let ordered: p5.Vector[] = [];
  const stepsPerFrame = 600000;

  const cellSize = radius / Math.sqrt(2); // cell width;

  // create empty grid
  const grid: PointsGrid = [];
  const cols = Math.floor(width / cellSize);
  const rows = Math.floor(height / cellSize);

  for (let i = 0; i < cols * rows; i++) {
    grid[i] = undefined;
  }

  // add initial point
  const x = width / 2;
  const y = height / 2;
  const i = Math.floor(x / cellSize);
  const j = Math.floor(y / cellSize);
  const pos = new p5.Vector(x, y);

  grid[i + j * cols] = pos;

  active.push(pos);

  for (var steps = 0; steps < stepsPerFrame; steps++) {
    if (active.length > 0) {
      //   const randIndex = floor(random(active.length));
      const randIndex = active.length - 1;
      const pos = active[randIndex];

      let found = false;
      // tries
      for (let n = 0; n < tries; n++) {
        const sample = p5.Vector.random2D();
        const mag = p.random(radius, 2 * radius);

        sample.setMag(mag);
        sample.add(pos);

        const col = Math.floor(sample.x / cellSize);
        const row = Math.floor(sample.y / cellSize);
        const cellIndex = col + row * cols;

        // find valid neighbor
        if (
          col >= 0 &&
          row >= 0 &&
          col < cols &&
          row < rows &&
          typeof grid[cellIndex] === "undefined"
        ) {
          let valid = true;

          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              const index = col + i + (row + j) * cols;
              const neighbor = grid[index];

              if (neighbor) {
                const d = p5.Vector.dist(sample, neighbor);

                if (d < radius) {
                  valid = false;
                  break;
                }
              }
            }
          }

          if (valid) {
            found = true;

            active.push(sample);

            if (!skipPoint(sample)) {
              grid[cellIndex] = sample;
              ordered.push(sample);
            } else {
              grid[cellIndex] = null;
            }

            break;
          }
        }
      }

      if (!found) {
        active.splice(randIndex, 1);
      }
    }
  }

  return { points: ordered, grid, extra: { cols, rows } };
}
