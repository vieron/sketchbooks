declare module "canvas-sketch-util/random" {
  export function range(min: number, max: number): number;
  export function rangeFloor(min: number, max: number): number;
  export function pick<T>(a: T[]): T;
  export function shuffle<T>(a: T[]): T[];
  export function permuteNoise(): void;
  export function noise2D(
    x: number,
    y: number,
    frequency: number = 1,
    amplitude: number = 1
  ): number;
  export function setSeed(seed: string | number): void;
}
