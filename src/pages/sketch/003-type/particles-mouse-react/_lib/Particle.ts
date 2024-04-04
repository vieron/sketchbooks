import random from "canvas-sketch-util/random";
import math from "canvas-sketch-util/math";

export default class Particle {
  x: number;
  y: number;
  ax: number;
  ay: number;
  vx: number;
  vy: number;
  ix: number;
  iy: number;
  minDist: number;
  pushFactor: number;
  pullFactor: number;
  dampFactor: number;
  radius: number;
  scale: number;
  color: string;

  constructor({
    x,
    y,
    radius,
    color,
  }: {
    x: number;
    y: number;
    radius: number;
    color: string;
  }) {
    // position
    this.x = x;
    this.y = y;
    // acceleration
    this.ax = 0;
    this.ay = 0;
    // velocity
    this.vx = 0;
    this.vy = 0;
    // initial position
    this.ix = x;
    this.iy = y;

    this.minDist = random.range(80, 160);
    this.pushFactor = random.range(0.01, 0.02);
    this.pullFactor = random.range(0.002, 0.006);
    this.dampFactor = random.range(0.9, 0.95);

    this.radius = radius;
    this.scale = 1;
    this.color = color;
  }

  update(cursor: { x: number; y: number }) {
    let dx, dy, dd, distDelta;

    // pull force
    dx = this.ix - this.x;
    dy = this.iy - this.y;
    dd = Math.sqrt(dx * dx + dy * dy);

    this.ax = dx * this.pullFactor;
    this.ay = dy * this.pullFactor;

    this.scale = math.mapRange(dd, 0, 200, 1, 5);

    // push force
    dx = this.x - cursor.x;
    dy = this.y - cursor.y;
    dd = Math.sqrt(dx * dx + dy * dy);

    distDelta = this.minDist - dd;

    if (dd < this.minDist) {
      this.ax += (dx / dd) * distDelta * this.pushFactor;
      this.ay += (dy / dd) * distDelta * this.pushFactor;
    }

    this.vx += this.ax;
    this.vy += this.ay;

    this.vx *= this.dampFactor;
    this.vy *= this.dampFactor;

    this.x += this.vx;
    this.y += this.vy;
  }

  draw(context: CanvasRenderingContext2D) {
    context.save();
    context.translate(this.x, this.y);
    context.fillStyle = this.color;

    // context.fillRect(
    //   0,
    //   0,
    //   this.radius * 2 * this.scale,
    //   this.radius * 2 * this.scale
    // );

    context.beginPath();
    context.arc(0, 0, this.radius * this.scale, 0, Math.PI * 2);
    context.fill();

    context.restore();
  }
}
