import p5 from "p5";

type Options = {
  radius: number;
  tries: number;
  width: number;
  height: number;
};

export default function poissonDisk({
  radius,
  tries,
  width,
  height,
}: Options): p5.Vector[] {
  const active: p5.Vector[] = [];
  let ordered: p5.Vector[] = [];
  const stepsPerFrame = 600000;

  const cellSize = radius / Math.sqrt(2); // cell width;

  // create empty grid
  const grid: (undefined | p5.Vector)[] = [];
  const cols = floor(width / cellSize);
  const rows = floor(height / cellSize);

  for (let i = 0; i < cols * rows; i++) {
    grid[i] = undefined;
  }

  // add initial point
  const x = width / 2;
  const y = height / 2;
  const i = floor(x / cellSize);
  const j = floor(y / cellSize);
  const pos = createVector(x, y);

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
        const mag = random(radius, 2 * radius);

        sample.setMag(mag);
        sample.add(pos);

        const col = floor(sample.x / cellSize);
        const row = floor(sample.y / cellSize);
        const cellIndex = col + row * cols;

        // find valid neighbor
        if (
          col >= 0 &&
          row >= 0 &&
          col < cols &&
          row < rows &&
          !grid[cellIndex]
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
            grid[cellIndex] = sample;

            active.push(sample);
            ordered.push(sample);
            break;
          }
        }
      }

      if (!found) {
        active.splice(randIndex, 1);
      }
    }
  }

  return ordered;
}
