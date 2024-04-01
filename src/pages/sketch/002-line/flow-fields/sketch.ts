import canvasSketch from "canvas-sketch";
import random from "canvas-sketch-util/random";
import math from "canvas-sketch-util/math";
import PoissonDiskSampling from "poisson-disk-sampling";
import memoize from "memoize-one";
import debounce from "lodash/debounce";
import colormap from "colormap";
import { createControls } from "./controls";
import PARAMS from "./params";
import type {
  CanvasSketchSettings,
  CreateSketch,
} from "canvas-sketch-types/canvas-sketch/lib/core/SketchManager";

const settings: CanvasSketchSettings = {
  dimensions: [window.innerWidth, window.innerHeight],
  animate: false,
  scaleToFit: false,
};

random.setSeed(PARAMS.seed);

const sketch: CreateSketch<typeof settings> = ({ width, height, render }) => {
  createControls(PARAMS, {
    onChange: debounce(render, 150),
    onSeedChange: (event) => {
      random.setSeed(event.value);
    },
  });

  //grid
  const gw = width * 1;
  const gh = height * 1;

  const cols = width / 2;
  const rows = height / 2;

  // cell
  const cw = gw / cols;
  const ch = gh / rows;

  // margin
  const mx = (width - gw) * 0.5;
  const my = (height - gh) * 0.5;

  const grid: Array<Array<number>> = [];
  const defaultAngle = Math.PI * 0.1;

  // set default angle for each cell
  for (let r = 0; r <= rows; r++) {
    grid[r] = [];
    for (let c = 0; c <= cols; c++) {
      grid[r][c] = defaultAngle;
    }
  }

  const colorShades = 30;
  const colors = colormap({
    // colormap: "velocity-blue",
    colormap: "winter",
    nshades: colorShades,
    format: "rgbaString",
    alpha: [0.1, 0.4],
  });

  // Add points
  // const startingPoints: number[][] = [];
  // // point per grid cell
  // const step = 4;
  // for (let r = 0; r < rows; r = r + step) {
  //   for (let c = 0; c < cols; c = c + step) {
  //     startingPoints.push([c * cw, r * ch + ch / 2]);
  //   }
  // }
  // // point starting from center along Y axis
  // for (let r = 0; r < rows; r = r + 30) {
  //   startingPoints.push([gw / 2, r * ch + ch / 2]);
  // }

  // points using Poisson Disk distribution
  const poisonFactor = 100;
  const createPossingDiskPoints = memoize(function (minDistance) {
    const poissonSampling = new PoissonDiskSampling({
      shape: [gw * poisonFactor, gh * poisonFactor],
      minDistance,
      // maxDistance: 100,
      tries: 10,
    });

    return poissonSampling.fill();
  });

  return ({ context, width, height }) => {
    context.fillStyle = PARAMS.backgroundColor;
    context.fillRect(0, 0, width, height);

    const startingPoints = createPossingDiskPoints(
      PARAMS.startingPointsMinDistance * poisonFactor
    ).map(([x, y]) => [x / poisonFactor, y / poisonFactor]) as number[][];

    // draw flow field vectors
    let frequency = PARAMS.noiseFrequency;
    let amplitude = 1;

    context.save();
    context.translate(mx, my);

    for (let r = 0; r <= rows; r++) {
      for (let c = 0; c <= cols; c++) {
        const noise = random.noise2D(c, r, frequency, amplitude);
        const angle = math.mapRange(noise, 0, amplitude, 0, Math.PI * 2);

        grid[r][c] = angle;

        if (PARAMS.showFlowField) {
          const x1 = c * cw;
          const y1 = r * cw;
          const length = cw;
          const x2 = x1 + length * Math.cos(angle);
          const y2 = y1 + length * Math.sin(angle);

          renderArrowLine(context, x1, y1, x2, y2);
          context.stroke();
        }
      }
    }
    context.restore();

    context.save();
    context.translate(mx, my);

    // draw lines
    startingPoints.forEach((point) => {
      let [x, y] = point;

      const numSteps = PARAMS.lineLength;
      const stepLength = 1;

      context.beginPath();
      // context.strokeStyle = PARAMS.lineColor;
      context.strokeStyle = colors[random.rangeFloor(0, colorShades - 1)];
      context.lineWidth = PARAMS.lineWidth;
      context.lineCap = "round";

      context.moveTo(x, y);

      for (let i = 0; i < numSteps; i++) {
        const row = Math.floor(y / ch);
        const col = Math.floor(x / cw);

        if (row < 0 || row > rows || col < 0 || col > cols) {
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
  };
};

function renderArrowLine(
  context: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number
) {
  const headlen = 14; // length of head in pixels
  const dx = toX - fromX;
  const dy = toY - fromY;
  const angle = Math.atan2(dy, dx);

  context.beginPath();
  context.moveTo(fromX, fromY);
  context.lineTo(toX, toY);
  context.lineTo(
    toX - headlen * Math.cos(angle - Math.PI / 6),
    toY - headlen * Math.sin(angle - Math.PI / 6)
  );
  context.moveTo(toX, toY);
  context.lineTo(
    toX - headlen * Math.cos(angle + Math.PI / 6),
    toY - headlen * Math.sin(angle + Math.PI / 6)
  );
}

canvasSketch(sketch, settings);
