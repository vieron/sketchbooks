import Control from "../Control";
import type { ButtonsControlDef } from "../types";
import { field, element, button } from "../utils";

export default class ButtonControl extends Control<ButtonsControlDef> {
  renderField() {
    const { def } = this;

    const buttons = def.actions.map(({ name, action }) =>
      button(name, {
        onclick: (_event) => action(),
      })
    );

    return field(buttons);
  }
}
