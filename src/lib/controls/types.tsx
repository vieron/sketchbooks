export type ControlDef =
  | NumberControlDef
  | TextControlDef
  | RangeControlDef
  | ColorControlDef
  | ColorPaletteControlDef
  | BooleanControlDef
  | ButtonControlDef;
export type ControlsDef = Record<string, ControlDef>;

export type ControlType = ControlDef["type"];

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
