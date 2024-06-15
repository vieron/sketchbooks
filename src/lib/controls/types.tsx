export type ControlDef =
  | NumberControlDef
  | TextControlDef
  | RangeControlDef
  | ColorControlDef
  | ColorPaletteControlDef
  | BooleanControlDef
  | ButtonControlDef
  | SelectControlDef;

export type ControlsDef = Record<string, ControlDef>;

export type ControlType = ControlDef["type"];

// TODO: separate action vs control
export interface ControlDefBase<Value> {
  name: string;
  type: string;
  value?: (controlValue: Value) => Value;
  defaultValue: Value;
}

export interface NumberControlDef extends ControlDefBase<number> {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
}

export interface RangeControlDef extends ControlDefBase<number> {
  type: "range";
  min?: number;
  max?: number;
  step?: number;
}

export interface TextControlDef extends ControlDefBase<string> {
  type: "text";
}

export interface SelectControlDef extends ControlDefBase<string> {
  type: "select";
  options: string[];
}

export interface ColorControlDef extends ControlDefBase<string> {
  type: "color";
}

export interface ColorPaletteControlDef
  extends ControlDefBase<[number, string][]> {
  type: "colorpalette";
}

export interface BooleanControlDef extends ControlDefBase<boolean> {
  type: "boolean";
}

export interface ButtonControlDef extends ControlDefBase<null> {
  type: "button";
  action: () => void;
}

type Preset<Controls extends ControlsDef> = Partial<{
  [Id in keyof Controls]: Controls[Id]["defaultValue"];
}>;

export type PresetsDef<Controls extends ControlsDef> = Record<
  string,
  Preset<Controls>
>;
