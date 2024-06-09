import Control from "../Control";
import type { ButtonControlDef } from "../types";
import { element } from "../utils";

export default class ColorControl extends Control<ButtonControlDef> {
  render(el: HTMLElement) {
    const { def } = this;

    const button = element(
      "button",
      {
        onclick: (_event) => def.action(),
      },
      [def.name]
    );

    const div = element("div", {}, [button]);

    el.appendChild(div);
  }
}
