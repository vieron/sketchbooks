import type Control from "./Control";
import BooleanControl from "./control-types/Boolean";
import ColorControl from "./control-types/Color";
import NumberControl from "./control-types/Number";
import RangeControl from "./control-types/Range";
import TextControl from "./control-types/Text";
import ButtonControl from "./control-types/Button";
import type { ControlDef, ControlsDef, PresetsDef } from "./types";
import ColorPaletteControl from "./control-types/ColorPalette";
import Presets from "./control-types/Presets";

type SubscribeFn = (value: Record<string, any>) => void;

export default class Controls<C extends ControlsDef> {
  private runtimeDef: C;
  private originalDef: C;
  private el: HTMLElement;
  private subscribers: SubscribeFn[] = [];

  public controls: {
    [Id in keyof C]: Control<C[Id]>;
  } = {} as {
    [Id in keyof C]: Control<C[Id]>;
  };

  private presets: Presets<C> = {} as Presets<C>;

  constructor(def: C, presets: PresetsDef<C>, el: HTMLElement) {
    this.originalDef = def;
    this.runtimeDef = def;
    this.presets = new Presets(presets);
    this.el = el;
  }

  public init() {
    this.load();
    this.render();
  }

  private registerControl(def: ControlDef) {
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

  private notifySubcribers = () => {
    // TODO: improve the way we report changes
    this.subscribers.forEach((fn) => fn(this));
  };

  private load() {
    // setup controls
    Object.entries(this.runtimeDef).reduce((controls, [key, def]) => {
      const control = this.registerControl(def);

      control.addEventListener("control:change", this.notifySubcribers);

      return Object.assign(controls, {
        [key]: control,
      });
    }, this.controls);
  }

  // TODO: improve how we handle preset updates and re-render Controls
  private renderPresetSelector() {
    this.presets.addEventListener("presets:change", (e: Event) => {
      const { preset } = (e as CustomEvent<{ preset: PresetsDef<C>[string] }>)
        .detail;

      Object.values(this.controls).forEach((control) => control.destroy());
      this.runtimeDef = Object.entries(this.originalDef).reduce(
        (defs, [key, def]) => {
          return Object.assign(defs, {
            [key]: {
              ...def,
              defaultValue: preset.hasOwnProperty(key)
                ? preset[key]
                : def.defaultValue,
            },
          });
        },
        {} as typeof this.originalDef
      );

      this.load();
      this.renderControls();
      this.notifySubcribers();
    });

    this.presets.render(this.el);
  }

  private renderControls() {
    Object.values(this.controls).forEach((control) => {
      control.render(this.el);
    });
  }

  private render() {
    this.renderPresetSelector();
    this.renderControls();
  }

  public subscribe(fn: SubscribeFn) {
    this.subscribers.push(fn);
  }

  public destroy() {
    Object.values(this.controls).forEach((control) => {
      control.removeEventListener("control:change", this.notifySubcribers);
      control.destroy();
    });
  }
}
