import Control from "../Control";
import type { SelectControlDef } from "../types";
import { controlField, element } from "../utils";

export default class SelectControl extends Control<SelectControlDef> {
  computeValue() {
    return this.def.value?.(this.controlValue) ?? this.def.defaultValue;
  }

  renderField() {
    const { def, controlValue } = this;

    const select = element(
      "select",
      {
        className:
          "px-1 py-1 text-xs font-medium text-slate-200 border-r-4 border-r-slate-700 bg-slate-700 rounded-lg hover:bg-slate-600 hover:border-r-slate-600 focus:ring-4 focus:outline-none focus:ring-blue-300",
        value: controlValue,
        onchange: (event) => {
          const target = event.target as HTMLSelectElement;
          const selected = target.value;

          target.value = selected;
          target.querySelector("option[selected]")?.removeAttribute("selected");
          target
            .querySelector(`options[value=${selected}]`)
            ?.setAttribute("selected", "selected");

          this.change(selected);
        },
      },
      def.options.map((id) => {
        return element(
          "option",
          {
            value: id,
            ...(controlValue === id ? { selected: true } : {}),
          },
          [id]
        );
      })
    );

    const field = controlField(def.name, [select]);

    return field;
  }
}
