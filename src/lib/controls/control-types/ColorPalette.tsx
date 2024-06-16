import palettes from "nice-color-palettes/200.json";
import Control from "../Control";
import type { ColorPaletteControlDef } from "../types";
import { controlField, element, button } from "../utils";

const DEFAULT_WEIGHT = 1;

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

export default class ColorPaletteControl extends Control<ColorPaletteControlDef> {
  computeValue() {
    return (
      this.def.value?.(this.controlValue ?? this.def.defaultValue) ??
      this.def.defaultValue
    );
  }

  private createColorPicker(color: string, index: number) {
    return element("input", {
      type: "color",
      value: color,
      className: "bg-slate-800",
      oninput: (event) => {
        const value = (event?.target as HTMLInputElement)?.value;
        const copy = [...this.controlValue];
        copy[index] = [DEFAULT_WEIGHT, value];

        this.change(copy);
      },
    });
  }

  renderField() {
    const { def, controlValue } = this;

    const colorPickers = controlValue.map(([_weight, color], index) =>
      this.createColorPicker(color, index)
    );

    const add = button("+", {
      className: "mr-1",
      title: "Add a new color",
      onclick: () => {
        const newColor = "#fabada";
        const node = this.createColorPicker(newColor, this.controlValue.length);
        colors.appendChild(node);

        this.change([...this.controlValue, [DEFAULT_WEIGHT, newColor]]);
      },
    });

    const remove = button("-", {
      title: "Remove last color",
      className: "mr-1",
      onclick: () => {
        colors.lastChild && colors.removeChild(colors.lastChild);
        this.change(this.controlValue.slice(0, -1));
      },
    });

    const random = button("random", {
      title: "Pick a random palette",
      className: "mr-1",
      onclick: () => {
        while (colors.lastChild) {
          colors.removeChild(colors.lastChild);
        }

        const randomPalette = palettes[getRandomInt(0, palettes.length - 1)];
        const weightedPalette = randomPalette.map((color, index) => {
          colors.appendChild(this.createColorPicker(color, index));

          return [1, color] satisfies [number, string];
        });

        this.change(weightedPalette);
      },
    });

    const colors = element(
      "div",
      { className: "flex flex-wrap align-items" },
      colorPickers
    );
    const controls = element("div", { className: "basis-full shrink-0" }, [
      remove,
      add,
      random,
    ]);

    const field = controlField(def.name, [colors, controls]);

    return field;
  }
}
