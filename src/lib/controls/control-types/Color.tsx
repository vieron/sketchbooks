import Control from "../Control";
import type { ColorControlDef } from "../types";
import { controlField, element } from "../utils";

export default class ColorControl extends Control<ColorControlDef> {
  computeValue() {
    return this.def.value?.(this.controlValue) ?? this.def.defaultValue;
  }

  renderField(el: HTMLElement) {
    const { def, controlValue } = this;

    const input = element("input", {
      type: "color",
      value: controlValue,
      oninput: (event) => {
        const value = (event?.target as HTMLInputElement)?.value;

        this.change(value);
      },
    });

    const field = controlField(def.name, [input]);

    return field;
  }
}
