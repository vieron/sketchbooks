import Control from "../Control";
import type { RangeControlDef } from "../types";
import { controlField, element } from "../utils";

export default class RangeControl extends Control<RangeControlDef> {
  computeValue() {
    return this.def.value?.(this.controlValue) ?? this.def.defaultValue;
  }
  render(el: HTMLElement) {
    const { def, controlValue } = this;

    const slider = element("input", {
      type: "range",
      className:
        "w-3/4 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg dark:bg-gray-700",
      value: "" + controlValue,
      min: "" + def.min,
      max: "" + def.max,
      step: "" + def.step,
      oninput: (event) => {
        const value = (event?.target as HTMLInputElement)?.value;

        input.value = value;
        this.change(+value);
      },
    });

    const input = element("input", {
      type: "number",
      value: "" + controlValue,
      min: "" + def.min,
      max: "" + def.max,
      step: "" + def.step,
      oninput: (event) => {
        const value = (event?.target as HTMLInputElement)?.value;

        slider.value = value;
        this.change(+value);
      },
    });

    const field = controlField(def.name, [slider, input]);

    el.appendChild(field);
  }
}
