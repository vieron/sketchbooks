import Control from "../Control";
import type { ButtonControlDef } from "../types";
import { field, element } from "../utils";

export default class ButtonControl extends Control<ButtonControlDef> {
  renderField() {
    const { def } = this;

    const button = element(
      "button",
      {
        className:
          "px-2 py-1 text-xs font-medium text-center text-white bg-slate-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300",
        onclick: (_event) => def.action(),
      },
      [def.name]
    );

    return field([button]);
  }
}
