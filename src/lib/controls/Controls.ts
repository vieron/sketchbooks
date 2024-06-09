import type Control from "./Control";
import BooleanControl from "./control-types/Boolean";
import ColorControl from "./control-types/Color";
import NumberControl from "./control-types/Number";
import RangeControl from "./control-types/Range";
import TextControl from "./control-types/Text";
import ButtonControl from "./control-types/Button";
import type { ControlDef, ControlsDef } from "./types";
import ColorPaletteControl from "./control-types/ColorPalette";

type SubscribeFn = (value: Record<string, any>) => void;

export default class Controls<C extends ControlsDef> {
  private def: C;
  private el: HTMLElement;
  private subscribers: SubscribeFn[] = [];
  // TODO: improve types
  private state: Record<string, any> = {};

  public controls: {
    [Id in keyof C]: Control<C[Id]>;
  } = {} as {
    [Id in keyof C]: Control<C[Id]>;
  };

  constructor(def: C, el: HTMLElement) {
    this.def = def;
    this.el = el;
  }

  init() {
    this.load();
    this.render();
  }

  register(def: ControlDef) {
    const { type } = def;

    switch (type) {
      case "number":
        return new NumberControl(def);
      case "range":
        return new RangeControl(def);
      case "text":
        return new TextControl(def);
      case "color":
        return new ColorControl(def);
      case "colorpalette":
        return new ColorPaletteControl(def);
      case "boolean":
        return new BooleanControl(def);
      case "button":
        return new ButtonControl(def);

      default:
        throw new Error(`Unsupported control type: ${type}`);
    }
  }

  load() {
    return Object.entries(this.def).reduce((controls, [key, def]) => {
      const control = this.register(def);

      control.addEventListener("control:change", (e) => {
        // TODO: improve the way we report changes
        this.subscribers.forEach((fn) => fn(this.state));
      });

      return Object.assign(controls, {
        [key]: control,
      });
    }, this.controls);
  }

  render() {
    Object.values(this.controls).forEach((control) => {
      control.render(this.el);
    });
  }

  subscribe(fn: SubscribeFn) {
    this.subscribers.push(fn);
  }
}
