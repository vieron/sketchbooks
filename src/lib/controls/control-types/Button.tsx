import Control from "../Control";
import type { ButtonControlDef } from "../types";
import { field, element, button } from "../utils";

export default class ButtonControl extends Control<ButtonControlDef> {
  renderField() {
    const { def } = this;

    return field([
      button(def.name, {
        onclick: (_event) => def.action(),
      }),
    ]);
  }
}
