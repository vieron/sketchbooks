import type Control from "./Control";
import BooleanControl from "./control-types/Boolean";
import ColorControl from "./control-types/Color";
import NumberControl from "./control-types/Number";
import RangeControl from "./control-types/Range";
import TextControl from "./control-types/Text";
import ButtonControl from "./control-types/Button";
import ButtonsControl from "./control-types/Buttons";
import type { ControlDef, ControlsDef, PresetsDef } from "./types";
import ColorPaletteControl from "./control-types/ColorPalette";
import Presets from "./Presets";
import SelectControl from "./control-types/Select";
import { element } from "./utils";

type SubscribeFn = (value: Record<string, any>) => void;

export type ControlsOptions<Defs extends ControlsDef> = {
  controls: Defs;
  presets?: PresetsDef<Defs>;
  defaultPreset?: PresetName<Defs> | string;
};

export type PresetName<Defs extends ControlsDef> = keyof PresetsDef<Defs>;

export default class Controls<C extends ControlsDef> {
  private runtimeDef: C;
  private originalDef: C;
  private presetDefs: PresetsDef<C>;
  private defaultPreset: keyof PresetsDef<C> | undefined;
  private el: HTMLElement;
  private subscribers: SubscribeFn[] = [];

  public controls: {
    [Id in keyof C]: Control<C[Id]>;
  } = {} as {
    [Id in keyof C]: Control<C[Id]>;
  };

  private presets: Presets<C> = {} as Presets<C>;

  constructor(
    { controls, presets = {}, defaultPreset }: ControlsOptions<C>,
    el: HTMLElement
  ) {
    this.originalDef = this.runtimeDef = controls;
    this.presetDefs = presets;
    this.presets = new Presets(presets ?? {}, defaultPreset);
    this.defaultPreset = defaultPreset;
    this.el = el;
  }

  public init() {
    this.defaultPreset && this.loadPreset(this.defaultPreset);
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
      case "buttons":
        return new ButtonsControl(def);
      case "select":
        return new SelectControl(def);

      default:
        throw new Error(`Unsupported control type: ${type}`);
    }
  }

  private notifySubcribers = () => {
    // TODO: improve the way we report changes
    this.subscribers.forEach((fn) => fn(this));
  };

  private loadPreset(preset: keyof PresetsDef<C>): void {
    const presetDef = this.presetDefs[preset];

    if (!presetDef) {
      throw new Error(
        `Preset named "${preset}" does not match any existing preset`
      );
    }

    // destroy existing controls
    Object.values(this.controls).forEach((control) => control.destroy());

    // override default values of control definitions
    this.runtimeDef = Object.entries(this.originalDef).reduce(
      (defs, [key, def]) => {
        if (!presetDef) {
          return Object.assign(defs, def);
        }

        return Object.assign(defs, {
          [key]: {
            ...def,
            defaultValue: presetDef.hasOwnProperty(key)
              ? presetDef[key]
              : def.defaultValue,
          },
        });
      },
      {} as typeof this.originalDef
    );
  }

  private load() {
    // setup this.controls
    Object.entries(this.runtimeDef).reduce((controls, [key, def]) => {
      const control = this.registerControl(def);

      control.addEventListener("control:change", this.notifySubcribers);

      return Object.assign(controls, {
        [key]: control,
      });
    }, this.controls);
  }

  private renderPresetSelector() {
    this.presets.addEventListener("presets:change", (e: Event) => {
      const presetName = (e as CustomEvent<{ value: keyof PresetsDef<C> }>)
        .detail?.value;

      this.loadPreset(presetName);
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
