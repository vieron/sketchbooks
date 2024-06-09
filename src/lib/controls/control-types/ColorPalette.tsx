import Control from "../Control";
import type { ColorPaletteControlDef } from "../types";
import { controlField, element } from "../utils";

const DEFAULT_WEIGHT = 1;

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

    const add = element(
      "button",
      {
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
        onclick: () => {
          colors.lastChild && colors.removeChild(colors.lastChild);
          this.change(this.controlValue.slice(0, -1));
        },
      },
      ["-"]
    );

    const colors = element("div", {}, colorPickers);

    const field = controlField(def.name, [colors, remove, add]);

    el.appendChild(field);
  }
}
