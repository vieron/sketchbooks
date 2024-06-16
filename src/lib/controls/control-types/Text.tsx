import Control from "../Control";
import type { TextControlDef } from "../types";
import { controlField, element } from "../utils";

export default class TextControl extends Control<TextControlDef> {
  computeValue() {
    return this.def.value?.(this.controlValue) ?? this.def.defaultValue;
  }

  renderField(el: HTMLElement) {
    const { def, controlValue } = this;

    const input = element("input", {
      type: "text",
      className:
        "bg-slate-700 border border-slate-900 shadow-inner text-slate-200 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full px-2 py-1",
      value: controlValue,
      onkeyup: (event) => {
        const value = (event?.target as HTMLInputElement)?.value;

        this.change(value);
      },
    });

    const field = controlField(def.name, [input]);

    return field;
  }
}
