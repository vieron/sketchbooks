import Control from "../Control";
import type { RangeControlDef } from "../types";
import { controlField, element } from "../utils";

export default class RangeControl extends Control<RangeControlDef> {
  computeValue() {
    return this.def.value?.(this.controlValue) ?? this.def.defaultValue;
  }

  renderField(el: HTMLElement) {
    const { def, controlValue } = this;
    // https://www.ctrl.blog/entry/html5-input-number-localization.html
    // https://codepen.io/aminimalanimal/full/bdOzRG
    const numberFormatter = new Intl.NumberFormat(navigator.language);

    const slider = element("input", {
      type: "range",
      className:
        "w-4/6 h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer range-lg",
      value: "" + controlValue,
      min:
        typeof def.min !== "undefined"
          ? numberFormatter.format(def.min)
          : undefined,
      max:
        typeof def.max !== "undefined"
          ? numberFormatter.format(def.max)
          : undefined,
      step: "" + def.step,
      oninput: (event) => {
        const value = (event?.target as HTMLInputElement)?.value;

        input.value = value;
        this.change(+value);
      },
    });

    const input = element("input", {
      type: "number",
      className:
        "w-2/6 bg-slate-700 border border-slate-900 shadow-inner text-slate-300 text-xs rounded-md focus:ring-blue-500 focus:border-slate-400 block w-full pl-2 pr-1 py-1",
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
