import Control from "../Control";
import type { ButtonControlDef } from "../types";
import { controlField, element } from "../utils";

export default class ButtonControl extends Control<ButtonControlDef> {
  renderField(el: HTMLElement) {
    const { def } = this;

    const button = element(
      "button",
      {
        className:
          "px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300",
        onclick: (_event) => def.action(),
      },
      [def.name]
    );

    const field = controlField("", [button]);

    return field;
  }
}
