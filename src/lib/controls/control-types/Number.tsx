import Control from "../Control";
import type { NumberControlDef } from "../types";
import { controlField, element } from "../utils";

export default class NumberControl extends Control<NumberControlDef> {
  computeValue() {
    return this.def.value?.(this.controlValue) ?? this.def.defaultValue;
  }

  render(root: HTMLElement) {
    const { def, controlValue } = this;

    const input = element("input", {
      type: "number",
      value: "" + controlValue,
      min: "" + def.min,
      max: "" + def.max,
      onchange: (event) => {
        const value = +(event?.target as HTMLInputElement)?.value;

        this.change(value);
      },
    });

    const field = controlField(def.name, [input]);

    root.appendChild(field);
  }
}
