import canvasSketch from "canvas-sketch";
import Particle from "./Particle";
import type {
  CreateSketch,
  CanvasSketchSettings,
} from "canvas-sketch/lib/core/SketchManager";

const settings: CanvasSketchSettings = {
  dimensions: [window.innerWidth, window.innerHeight],
  animate: true,
  scaleToFit: false,
};

const textColor = "black";
const bgColor = "white";
const density = 4;

function createTextImage(text: string, fontSize: string) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d")!;

  canvas.width = 9999;
  canvas.height = 9999;

  const x = 20;
  const y = 20;

  // context.fillStyle = "black";
  // context.fillRect(0, 0, canvas.width, canvas.height);

  context.font = `${fontSize} Arial Black`;
  context.fillStyle = textColor;
  context.letterSpacing = "-14px";
  context.textBaseline = "top";
  context.fillText(text, x, y);

  const textMetrics = context.measureText(text);
  const bounds = {
    x: x - textMetrics.actualBoundingBoxLeft,
    y: y - textMetrics.actualBoundingBoxAscent,
    width:
      x +
      textMetrics.actualBoundingBoxRight -
      (x - textMetrics.actualBoundingBoxLeft),
    height:
      y +
      textMetrics.actualBoundingBoxDescent -
      (y - textMetrics.actualBoundingBoxAscent) +
      2,
  };

  return context.getImageData(bounds.x, bounds.y, bounds.width, bounds.height);
}

function imageToParticles(image: ImageData, gap: number) {
  const particles = [];

  for (let y = 0; y < image.height; y += gap) {
    for (let x = 0; x < image.width; x += gap) {
      const index = (y * image.width + x) * 4;
      const alpha = image.data[index + 3];

      if (alpha === 0) {
        continue;
      }

      const color = `rgba(${image.data[index]}, ${image.data[index + 1]}, ${
        image.data[index + 2]
      }, ${alpha})`;

      particles.push(new Particle({ x, y, radius: gap / 2, color }));
    }
  }

  return particles;
}

const cursor = { x: Infinity, y: Infinity };

const sketch: CreateSketch<typeof settings> = ({ canvas }) => {
  const image = createTextImage(
    "VALENTINA",
    `${Math.round(window.innerWidth * 0.16)}px`
  );
  const particles = imageToParticles(image, density);

  const onMouseMove = (e: MouseEvent) => {
    const x = (e.offsetX / canvas.offsetWidth) * canvas.width;
    const y = (e.offsetY / canvas.offsetHeight) * canvas.height;

    cursor.x = x;
    cursor.y = y;
  };

  const onMouseUp = () => {
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);

    cursor.x = 9999;
    cursor.y = 9999;
  };

  canvas.addEventListener("mousemove", onMouseMove);

  return ({ context, width, height }) => {
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);

    // context.putImageData(image, 0, 300);
    context.save();

    particles.forEach((particle) => {
      particle.update(cursor);
      particle.draw(context);
    });

    context.restore();
  };
};

canvasSketch(sketch, settings);
