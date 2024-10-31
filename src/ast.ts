import { JsonPosition } from "./position.js";
import { Visitor } from "./visitor.js";

export enum JsonNodeTypes {
  DOCUMENT = "document",
  COMMENT = "comment",
  OBJECT = "object",
  PROPERTY = "property",
  KEY = "key",
  ARRAY = "array",
  VALUE = "value",
  STRING = "string",
  NUMBER = "number",
  TRUE = "true",
  FALSE = "false",
  NULL = "null",
  ERROR = "error",
}

export interface IJsonNode {
  position: JsonPosition;
  type: JsonNodeTypes;
  accept(visitor: Visitor): void;
}

export interface IJsonValue extends IJsonNode {
  value: any;
  type: JsonNodeTypes;
}

// All elements in the tree will extend the `JsonNode` base class
export abstract class JsonNode implements IJsonNode {
  public position: JsonPosition = null;

  public readonly type: JsonNodeTypes = JsonNodeTypes.ERROR;

  public accept(visitor: Visitor): void {
    visitor.visit(this as unknown as JsonNodeType);
  }
}

export class JsonDocument extends JsonNode {
  public child: any = null;

  public readonly comments: JsonComment[] = [];

  public readonly type: JsonNodeTypes.DOCUMENT = JsonNodeTypes.DOCUMENT;
}

export class JsonObject extends JsonNode {
  public readonly properties: JsonProperty[] = [];

  public readonly comments: JsonComment[] = [];

  public readonly type: JsonNodeTypes.OBJECT = JsonNodeTypes.OBJECT;
}

export class JsonProperty extends JsonNode {
  public key: JsonKey = null;

  public value: JsonValue = null;

  public readonly type: JsonNodeTypes.PROPERTY = JsonNodeTypes.PROPERTY;
}

export class JsonArray extends JsonNode {
  public readonly items: any[] = [];

  public readonly comments: JsonComment[] = [];

  public readonly type: JsonNodeTypes.ARRAY = JsonNodeTypes.ARRAY;
}

export class JsonValue extends JsonNode implements IJsonValue {
  public readonly type: JsonNodeTypes.VALUE = JsonNodeTypes.VALUE;

  constructor(public value: any = null) {
    super();
  }
}

export class JsonKey extends JsonNode implements IJsonValue {
  public readonly type: JsonNodeTypes.KEY = JsonNodeTypes.KEY;

  constructor(public value: string = null, public decoded: string = null) {
    super();
  }
}

export class JsonComment extends JsonNode implements IJsonValue {
  public readonly type: JsonNodeTypes.COMMENT = JsonNodeTypes.COMMENT;

  constructor(public value: string = null) {
    super();
  }
}

export class JsonString extends JsonNode implements IJsonValue {
  public readonly type: JsonNodeTypes.STRING = JsonNodeTypes.STRING;

  constructor(public value: string = null, public decoded: string = null) {
    super();
  }
}

export class JsonNumber extends JsonNode implements IJsonValue {
  public readonly type: JsonNodeTypes.NUMBER = JsonNodeTypes.NUMBER;

  constructor(public value: number = null) {
    super();
    if (typeof value === "string") {
      this.value = parseFloat(value);
    }
  }
}

export class JsonTrue extends JsonNode implements IJsonValue {
  public readonly value = true as const;

  public readonly type: JsonNodeTypes.TRUE = JsonNodeTypes.TRUE;
}

export class JsonFalse extends JsonNode implements IJsonValue {
  public readonly value = false as const;

  public readonly type: JsonNodeTypes.FALSE = JsonNodeTypes.FALSE;
}

export class JsonNull extends JsonNode implements IJsonValue {
  public readonly value = null;

  public readonly type: JsonNodeTypes.NULL = JsonNodeTypes.NULL;
}

const nodeTypeObjectMapping = {
  [JsonNodeTypes.DOCUMENT]: JsonDocument,
  [JsonNodeTypes.COMMENT]: JsonComment,
  [JsonNodeTypes.OBJECT]: JsonObject,
  [JsonNodeTypes.PROPERTY]: JsonProperty,
  [JsonNodeTypes.KEY]: JsonKey,
  [JsonNodeTypes.ARRAY]: JsonArray,
  [JsonNodeTypes.VALUE]: JsonValue,
  [JsonNodeTypes.STRING]: JsonString,
  [JsonNodeTypes.NUMBER]: JsonNumber,
  [JsonNodeTypes.TRUE]: JsonTrue,
  [JsonNodeTypes.FALSE]: JsonFalse,
  [JsonNodeTypes.NULL]: JsonNull,
};
export type JsonNodeType =
  | JsonDocument
  | JsonComment
  | JsonObject
  | JsonProperty
  | JsonKey
  | JsonArray
  | JsonValue
  | JsonString
  | JsonNumber
  | JsonTrue
  | JsonFalse
  | JsonNull;
//
// Utility methods to construct the objects
//
export class NodeFactory {
  static fromType<T extends JsonNode>(objectType: JsonNodeTypes, _value = null, _decoded = null): T {
    const clazz = nodeTypeObjectMapping[objectType];
    if (clazz === null) throw new Error(`AST node of type ${objectType} cannot be found`);
    return new clazz(_value, _decoded);
  }
}

// Just a recursive, slow implementation to a JavaScript object from this
// JsonNode
function recursiveNodeConversion(rootNode: JsonNodeType): any {
  let result = null;
  switch (rootNode.type) {
    case JsonNodeTypes.DOCUMENT:
      return recursiveNodeConversion(rootNode.child);
    case JsonNodeTypes.OBJECT: {
      result = {};

      rootNode.properties.forEach((propNode) => {
        result[recursiveNodeConversion(propNode.key)] = recursiveNodeConversion(propNode.value);
      });
      return result;
    }
    case JsonNodeTypes.ARRAY: {
      result = [];
      rootNode.items.forEach((itemNode) => {
        result.push(recursiveNodeConversion(itemNode));
      });
      return result;
    }
    case JsonNodeTypes.VALUE:
      return rootNode.value;
    case JsonNodeTypes.STRING:
    case JsonNodeTypes.KEY:
      return rootNode.decoded ?? rootNode.value;
    case JsonNodeTypes.NUMBER: {
      if (typeof rootNode.value !== "number") return parseFloat((rootNode as any).value);
      return rootNode.value;
    }
    case JsonNodeTypes.TRUE:
      return true;
    case JsonNodeTypes.FALSE:
      return false;
    case JsonNodeTypes.NULL:
      return null;
    default:
      return undefined;
  }
}

export function toObject<T extends Record<string, unknown>>(jsonNode: JsonNode): T {
  return JSON.parse(JSON.stringify(jsonNode));
}

export function toString(jsonNode: JsonNode): string {
  return JSON.stringify(jsonNode);
}

export function toJSON<T>(jsonNode: JsonNodeType): T {
  if (!(jsonNode instanceof JsonNode)) throw new Error("JSON conversion only accepts a kind of JsonNode");

  return recursiveNodeConversion(jsonNode);
}
