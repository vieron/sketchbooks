import Control from "./Control";
import type { ControlsDef, PresetsDef } from "./types";
import { controlField, element } from "./utils";

export default class Presets<C extends ControlsDef> extends EventTarget {
  public defs: PresetsDef<C>;
  private selectedPreset: string;

  constructor(presets: PresetsDef<C>, selectedPreset?: keyof PresetsDef<C>) {
    super();

    this.defs = presets;
    this.selectedPreset = selectedPreset ?? Object.keys(this.defs)[0];
  }

  render(el: HTMLElement): HTMLElement | undefined {
    if (!Object.keys(this.defs).length) {
      return;
    }

    const select = element(
      "select",
      {
        className:
          "px-1 py-1 text-xs font-medium text-center text-white border-r-4 border-r-blue-700 bg-blue-700 rounded-lg hover:bg-blue-800 hover:border-r-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300",
        onchange: (_event) => {
          const target = _event.target as HTMLSelectElement;
          this.selectedPreset = target.value;

          const preset = this.defs[this.selectedPreset];

          target.value = this.selectedPreset;
          target.querySelector("option[selected]")?.removeAttribute("selected");
          target
            .querySelector(`options[value=${this.selectedPreset}]`)
            ?.setAttribute("selected", "selected");

          this.dispatchEvent(
            new CustomEvent("presets:change", {
              detail: {
                value: this.selectedPreset,
                preset,
              },
            })
          );
        },
      },
      Object.keys(this.defs).map((id) => {
        return element(
          "option",
          {
            value: id,
            ...(this.selectedPreset === id ? { selected: true } : {}),
          },
          [id]
        );
      })
    );

    const field = controlField("Presets", [select]);

    el.appendChild(field);
  }
}
