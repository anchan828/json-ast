import { IJsonNode } from "./ast.js";
import { JsonPosition } from "./position.js";

export enum JsonTokenTypes {
  COMMENT = "COMMENT", // // ... \n\r? or /* ... */
  LEFT_BRACE = "LEFT_BRACE", // {
  RIGHT_BRACE = "RIGHT_BRACE", // }
  LEFT_BRACKET = "LEFT_BRACKET", // [
  RIGHT_BRACKET = "RIGHT_BRACKET", // ]
  COLON = "COLON", //  :
  COMMA = "COMMA", // ,
  STRING = "STRING", //
  NUMBER = "NUMBER", //
  TRUE = "TRUE", // true
  FALSE = "FALSE", // false
  NULL = "NULL", // null
  IDENTIFIER = "IDENTIFIER", // identifiers
}

export interface ParseResult<T extends IJsonNode> {
  value: T;
  index: number;
}

export interface ParseSettings {
  verbose: boolean;
  junker: boolean;
}

export interface JsonToken {
  type: JsonTokenTypes;
  value: string;
  decoded?: string;
  position?: JsonPosition;
}
