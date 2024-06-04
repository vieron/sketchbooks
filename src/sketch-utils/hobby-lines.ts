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
  p: p5,
  points: p5.Vector[],
  {
    pointsPerLine = () => 2,
    strokeColor = p.color("black"),
    strokeWidth = 2,
    lineWeight = 10,
    fgPalette = [
      [0.5, p.color(210, 100, 100)],
      [0.2, p.color(210, 80, 100)],
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
        tension: p.random(0.8, 1),
        cyclic: false,
      });

      // background line
      drawLine(p, {
        strokeColor: strokeColor,
        strokeWeight: lineWeight + strokeWidth * 2,
        origin: currentLine[0],
        points: hobbyPoints,
      });

      // foreground line
      drawLine(p, {
        strokeColor: chooseWeighted(p, fgPalette),
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

function drawLine(
  p: p5,
  o: {
    strokeColor: p5.Color;
    strokeWeight: number;
    origin: p5.Vector;
    points: {
      startControl: BezierPoint;
      endControl: BezierPoint;
      point: BezierPoint;
    }[];
  }
) {
  p.noFill();
  p.stroke(o.strokeColor);
  p.strokeWeight(o.strokeWeight);
  p.beginShape();
  p.vertex(o.origin.x, o.origin.y);
  o.points.forEach(({ startControl, endControl, point }) => {
    p.bezierVertex(
      startControl.x,
      startControl.y,
      endControl.x,
      endControl.y,
      point.x,
      point.y
    );
  });
  p.endShape();
}
