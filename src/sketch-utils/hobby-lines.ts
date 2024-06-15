import p5 from "p5";
import { createHobbyBezier } from "hobby-curve";
import { chooseWeighted } from "./random";

type Options = {
  pointsPerLine?: () => number;
  strokeColor?: p5.Color;
  strokeWidth?: number;
  lineWeight?: number;
  fgPalette?: [number, string][];
  tension?: number;
};

export function drawHobbyLines(
  p: p5,
  lines: p5.Vector[][],
  {
    strokeColor = p.color("black"),
    strokeWidth = 2,
    lineWeight = 10,
    fgPalette = [[1, "red"]],
    tension = 0.8,
  }: Options
): void {
  // draw lines
  lines.forEach((line) => {
    const hobbyPoints = createHobbyBezier(line, {
      tension: tension,
      cyclic: false,
    });

    // background line
    drawLine(p, {
      strokeColor: strokeColor,
      strokeWeight: lineWeight + strokeWidth * 2,
      origin: line[0],
      points: hobbyPoints,
    });

    // foreground line
    drawLine(p, {
      strokeColor: chooseWeighted(p, fgPalette),
      strokeWeight: lineWeight,
      origin: line[0],
      points: hobbyPoints,
    });
  });
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
