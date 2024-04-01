declare module "canvas-sketch-util/color" {
  type ColorResult = {
    hex: string;
    alpha: number;
    rgb: [number, number, number];
    rgba: [number, number, number, number];
    hsl: [number, number, number];
    hsla: [number, number, number, number];
  };

  export default {
    parse(color: string): ColorResult
  };
}
