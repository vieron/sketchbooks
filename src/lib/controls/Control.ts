import type { ControlDef, ControlDefBase } from "./types";
import { element } from "./utils";

export default class Control<
  C extends ControlDefBase<any>
> extends EventTarget {
  protected def: C;
  protected controlValue: C["defaultValue"];
  protected field: HTMLElement | null = null;

  constructor(def: C) {
    super();

    this.def = def;
    this.controlValue = def.defaultValue;

    if (typeof this.def.value === "function") {
      this.controlValue = this.computeValue();
    }
  }

  // To implement by inheritors
  protected computeValue(): C["defaultValue"] {
    return this.def.defaultValue;
  }

  protected change(value: C["defaultValue"]) {
    this.controlValue = value;

    if (typeof this.def.value === "function") {
      this.controlValue = this.computeValue();
    }

    // TODO: optimize
    // if (this.value !== value) {
    this.dispatchEvent(
      new CustomEvent("control:change", {
        detail: {
          value,
        },
      })
    );
    // }
  }

  render(el: HTMLElement): void {
    this.field = this.renderField(el);
    el.appendChild(this.field);
  }

  renderField(_el: HTMLElement): HTMLElement {
    return element("div", {}, ["Missing renderField method in control"]);
  }

  destroy(): void {
    this.field?.parentNode?.removeChild(this.field);
  }

  get value(): C["defaultValue"] {
    return this.controlValue;
  }
}

// TODO: defaultvalue, value
