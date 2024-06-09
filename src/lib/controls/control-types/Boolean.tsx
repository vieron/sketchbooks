import Control from "../Control";
import type { BooleanControlDef } from "../types";
import { controlField, element } from "../utils";

export default class BooleanControl extends Control<BooleanControlDef> {
  computeValue() {
    return this.def.value?.(this.controlValue) ?? this.def.defaultValue;
  }

  render(el: HTMLElement) {
    const { def, controlValue } = this;

    const input = element("input", {
      type: "checkbox",
      checked: controlValue,
      onchange: (event) => {
        const checked = (event?.target as HTMLInputElement)?.checked;

        this.change(checked);
      },
    });

    const field = controlField(def.name, [input]);

    el.appendChild(field);
  }
}
