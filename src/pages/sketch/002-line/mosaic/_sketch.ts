import canvasSketch from "canvas-sketch";
import random from "canvas-sketch-util/random";
import Color from "canvas-sketch-util/color";
import math from "canvas-sketch-util/math";
import PoissonDiskSampling from "poisson-disk-sampling";
import memoize from "memoize-one";
import palettes from "nice-color-palettes/500.json";
import type {
  CreateSketch,
  CanvasSketchSettings,
} from "canvas-sketch/lib/core/SketchManager";

const settings: CanvasSketchSettings = {
  dimensions: [globalThis.innerWidth, globalThis.innerHeight],
  animate: false,
  scaleToFit: false,
};

const palette = random.pick(palettes);

const PARAMS = {
  gutter: 8,
  columns: 3,
  rows: 3,
  startingPointsMinDistance: 10,
  lineLength: 900,
  lineWidth: 5,
  colors: random
    .shuffle(palette)
    .slice(0, 3)
    .map((hex) => Color.parse(hex)),
  noiseFrequency: 0.0004,
  backgroundColor: "#FFF",
};

function drawRect({
  x,
  y,
  width,
  height,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
}): (context: CanvasRenderingContext2D) => void {
  // points using Poisson Disk distribution
  const poisonFactor = 100;
  const createPossingDiskPoints = memoize(function (minDistance) {
    const poissonSampling = new PoissonDiskSampling({
      shape: [width * poisonFactor, height * poisonFactor],
      minDistance: minDistance * poisonFactor,
      // maxDistance: 100,
      tries: 10,
    });

    return poissonSampling.fill().map((point) => {
      return [
        Math.floor(point[0] / poisonFactor),
        Math.floor(point[1] / poisonFactor),
      ];
    });
  });

  const grid: number[][] = [];

  // set default angle for each cell
  const defaultAngle = Math.PI * 0.1;

  for (let r = 0; r <= height; r++) {
    grid[r] = [];
    for (let c = 0; c <= width; c++) {
      grid[r][c] = defaultAngle;
    }
  }

  return (context) => {
    random.permuteNoise();

    context.save();
    context.rect(x, y, width, height);
    context.clip();

    // draw background
    const bgColor = random.pick(PARAMS.colors);
    // context.fillStyle = `hsla(${bgColor.hsla[0]}, ${bgColor.hsla[1]}%, 80%, 1)`;
    context.fillStyle = bgColor.hex;
    context.fillRect(x, y, width, height);

    context.save();
    context.translate(x, y);

    for (let r = 0; r <= height; r++) {
      for (let c = 0; c <= width; c++) {
        const noise = random.noise2D(c, r, PARAMS.noiseFrequency);
        const angle = math.mapRange(noise, -1, 1, 0, Math.PI * 2);

        grid[r][c] = angle;
      }
    }
    context.restore();

    context.save();
    context.translate(x, y);

    const startingPoints = createPossingDiskPoints(
      PARAMS.startingPointsMinDistance
    );

    startingPoints.forEach((point) => {
      let [x, y] = point;

      const stepLength = 2;

      context.beginPath();

      context.strokeStyle = random.pick(PARAMS.colors).hex;

      // context.strokeStyle = `hsla(${[
      //   random.pick(PARAMS.colorHues), // hue
      //   "90%", // saturation
      //   `${random.rangeFloor(30, 101)}%`, // lightness
      //   1, // alpha
      // ].join(", ")})`;

      context.lineWidth = PARAMS.lineWidth;
      // context.lineCap = "round";

      context.moveTo(x, y);

      for (let i = 0; i < PARAMS.lineLength; i++) {
        // const row = Math.min(height, Math.max(0, Math.floor(y)));
        // const col = Math.min(width, Math.max(0, Math.floor(x)));
        const row = Math.floor(y);
        const col = Math.floor(x);

        if (row < 0 || row > height || col < 0 || col > width) {
          continue;
        }

        const angle = grid[row][col];
        const xStep = stepLength * Math.cos(angle);
        const yStep = stepLength * Math.sin(angle);

        x += xStep;
        y += yStep;

        context.lineTo(x, y);
      }
      context.stroke();
    });

    context.restore();
    context.restore();
  };
}

const sketch: CreateSketch<typeof settings> = ({ width, height }) => {
  //grid
  const gw = width * 1;
  const gh = height * 1;

  const gutter = PARAMS.gutter;
  const cols = PARAMS.columns;
  const rows = PARAMS.rows;

  // cell
  const cw = (gw - gutter * (cols - 1)) / cols;
  const ch = (gh - gutter * (rows - 1)) / rows;

  const rects: ((context: CanvasRenderingContext2D) => void)[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const opts = {
        x: Math.floor(c * cw + c * gutter),
        y: Math.floor(r * ch + r * gutter),
        width: cw,
        height: ch,
      };

      rects.push(drawRect(opts));
    }
  }

  return ({ context, width, height }) => {
    context.fillStyle = PARAMS.backgroundColor;
    context.fillRect(0, 0, width, height);

    rects.forEach((rect) => {
      rect(context);
    });
  };
};

canvasSketch(sketch, settings);
