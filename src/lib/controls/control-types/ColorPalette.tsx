import palettes from "nice-color-palettes/200.json";
import Control from "../Control";
import type { ColorPaletteControlDef } from "../types";
import { controlField, element } from "../utils";

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
      oninput: (event) => {
        const value = (event?.target as HTMLInputElement)?.value;
        const copy = [...this.controlValue];
        copy[index] = [DEFAULT_WEIGHT, value];

        this.change(copy);
      },
    });
  }

  render(el: HTMLElement) {
    const { def, controlValue } = this;

    const colorPickers = controlValue.map(([_weight, color], index) =>
      this.createColorPicker(color, index)
    );

    const buttonClass =
      "mr-1 inline-block rounded border border-indigo-600 bg-transparent p-1 align-middle text-sm leading-none font-medium text-indigo-600 hover:bg-transparent hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring active:text-white";

    const add = element(
      "button",
      {
        className: buttonClass,
        title: "Add a new color",
        onclick: () => {
          const newColor = "#fabada";
          const node = this.createColorPicker(
            newColor,
            this.controlValue.length
          );
          colors.appendChild(node);

          this.change([...this.controlValue, [DEFAULT_WEIGHT, newColor]]);
        },
      },
      ["+"]
    );
    const remove = element(
      "button",
      {
        title: "Remove last color",
        className: buttonClass,
        onclick: () => {
          colors.lastChild && colors.removeChild(colors.lastChild);
          this.change(this.controlValue.slice(0, -1));
        },
      },
      ["-"]
    );
    const random = element(
      "button",
      {
        title: "Pick a random palette",
        className: buttonClass,
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
      },
      ["random"]
    );

    const colors = element("div", {}, colorPickers);
    const field = controlField(def.name, [colors, remove, add, random]);

    el.appendChild(field);
  }
}
