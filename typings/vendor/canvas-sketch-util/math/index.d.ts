declare module "canvas-sketch-util/math" {
  export function mapRange(
    value: number,
    inputStart: number,
    inputEnd: number,
    outputStart: number,
    outputEnd: number
  ): number;
  export function lerpArray(
    minVector: number[],
    maxVector: number[],
    t: number,
    out: number[] = []
  ): number[];
  export function linspace(N: number, inclusive: boolean = false): number[];
}
