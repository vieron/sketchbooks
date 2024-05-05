declare module "fast-2d-poisson-disk-sampling" {
  export default class FastPoissonDiskSampling {
    constructor({ shape: [number, number], radius: number, tries: number });
    fill(): [number, number][];
    getAllPoints(): [number, number][];
    addRandomPoint(): [number, number];
    addPoint(): [number, number];
    next(): [number, number];
    reset(): void;
  }
}
