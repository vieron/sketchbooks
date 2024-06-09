import type { ControlDef } from "./types";

export default class Control<C extends ControlDef> extends EventTarget {
  protected def: C;
  protected controlValue: C["defaultValue"];

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

  render(el: HTMLElement): void {}

  get value(): C["defaultValue"] {
    return this.controlValue;
  }
}

// TODO: defaultvalue, value
