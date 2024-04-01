import { Pane, type TpChangeEvent } from "tweakpane";
import type PARAMS from "./_params";

export function createControls(
  params: typeof PARAMS,
  {
    onSeedChange = () => {},
    onChange = () => {},
  }: {
    onSeedChange: (event: TpChangeEvent<number>) => void;
    onChange: () => void;
  }
) {
  const pane = new Pane();

  const f1 = pane.addFolder({
    title: "Randomness",
  });

  const seedControl = f1.addInput(params, "seed", {
    min: 1,
    max: 99999,
    step: 1,
  });

  f1.addInput(params, "noiseFrequency", {
    label: "noise frequency",
    min: 0,
    max: 0.2,
    step: 0.0001,
  });

  const f2 = pane.addFolder({
    title: "Canvas",
  });

  f2.addInput(params, "backgroundColor", {
    label: "background color",
    picker: "inline",
  });

  const f3 = pane.addFolder({
    title: "Lines",
  });

  f3.addInput(params, "lineWidth", {
    label: "width",
    min: 0.1,
    max: 40,
    step: 0.1,
  });

  f3.addInput(params, "lineColor", {
    label: "color",
    picker: "inline",
  });

  f3.addInput(params, "lineLength", {
    label: "length",
    min: 1,
    max: 800,
    step: 1,
  });

  f3.addInput(params, "startingPointsMinDistance", {
    label: "point min distance",
    min: 1,
    max: 200,
    step: 1,
  });

  // const f4 = pane.addFolder({
  //   title: "Debug",
  // });

  // f4.addInput(params, "showFlowField", {
  //   label: "show flow field",
  // });

  seedControl.on("change", onSeedChange);
  pane.on("change", onChange);
}
