import Control from "../Control";
import type { TextControlDef } from "../types";
import { controlField, element } from "../utils";

export default class TextControl extends Control<TextControlDef> {
  computeValue() {
    return this.def.value?.(this.controlValue) ?? this.def.defaultValue;
  }

  render(el: HTMLElement) {
    const { def, controlValue } = this;

    const input = element("input", {
      type: "text",
      value: controlValue,
      onkeyup: (event) => {
        const value = (event?.target as HTMLInputElement)?.value;

        this.change(value);
      },
    });

    const field = controlField(def.name, [input]);

    el.appendChild(field);
  }
}
