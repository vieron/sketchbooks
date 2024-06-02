import p5 from "p5";
import { createHobbyBezier } from "hobby-curve";
import { chooseWeighted } from "./random";

type Options = {
  pointsPerLine?: () => number;
  strokeColor?: p5.Color;
  strokeWidth?: number;
  lineWeight?: number;
  fgPalette?: [number, p5.Color][];
  skipPoint?: (point: p5.Vector) => boolean;
};

export function drawHobbyLines(
  points: p5.Vector[],
  {
    pointsPerLine = () => 2,
    strokeColor = color("black"),
    strokeWidth = 2,
    lineWeight = 10,
    fgPalette = [
      [0.5, color(210, 100, 100)],
      [0.2, color(210, 80, 100)],
    ],
    skipPoint = () => false,
  }: Options
) {
  let currentLine: p5.Vector[] = [];
  let localPointsPerLine: number = pointsPerLine();

  // draw lines
  for (var i = 0; i < points.length; i++) {
    const point = points[i];

    if (skipPoint(point)) {
      continue;
    }

    currentLine.push(point);

    // draw lines when it reaches the desired number of points
    if (currentLine.length === localPointsPerLine) {
      const hobbyPoints = createHobbyBezier(currentLine, {
        tension: random(0.8, 1),
        cyclic: false,
      });

      // background line
      drawLine({
        strokeColor: strokeColor,
        strokeWeight: lineWeight + strokeWidth * 2,
        origin: currentLine[0],
        points: hobbyPoints,
      });

      // foreground line
      drawLine({
        strokeColor: chooseWeighted(fgPalette),
        strokeWeight: lineWeight,
        origin: currentLine[0],
        points: hobbyPoints,
      });

      // empty line
      currentLine = [];
      localPointsPerLine = pointsPerLine();
    }
  }
}

interface BezierPoint {
  x: number;
  y: number;
}

function drawLine(p: {
  strokeColor: p5.Color;
  strokeWeight: number;
  origin: p5.Vector;
  points: {
    startControl: BezierPoint;
    endControl: BezierPoint;
    point: BezierPoint;
  }[];
}) {
  noFill();
  stroke(p.strokeColor);
  strokeWeight(p.strokeWeight);
  beginShape();
  vertex(p.origin.x, p.origin.y);
  p.points.forEach(({ startControl, endControl, point }) => {
    bezierVertex(
      startControl.x,
      startControl.y,
      endControl.x,
      endControl.y,
      point.x,
      point.y
    );
  });
  endShape();
}
