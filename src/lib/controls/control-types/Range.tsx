import Control from "../Control";
import type { RangeControlDef } from "../types";
import { controlField, element } from "../utils";

export default class RangeControl extends Control<RangeControlDef> {
  computeValue() {
    return this.def.value?.(this.controlValue) ?? this.def.defaultValue;
  }
  renderField(el: HTMLElement) {
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
      // className: "w-1/4 w-fit",
      className:
        "w-1/4 bg-gray-50 border border-gray-300 text-slate-600 text-xs rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full pl-2 pr-1 py-1",
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

    const group = element(
      "div",
      {
        className: "flex gap-2 items-center",
      },
      [slider, input]
    );

    const field = controlField(def.name, [group]);

    return field;
  }
}
