import { IJsonNode } from "./ast.js";
import { JsonPosition } from "./position.js";
export interface ParseResult<T extends IJsonNode> {
  value: T;
  index: number;
}

export interface ParseSettings {
  verbose: boolean;
  junker: boolean;
}

export interface JsonToken {
  type: any;
  value: any;
  position?: JsonPosition;
}
