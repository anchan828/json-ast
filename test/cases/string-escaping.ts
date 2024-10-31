import { createDocument, createObject, createEscapedObjectKey, createObjectProperty, createEscapedString } from "../types";

const object = createObject;
const key = createEscapedObjectKey;
const prop = createObjectProperty;
const string = createEscapedString;
const doc = createDocument;

const ast = object([
  prop(key('quota\\"tion', 'quota"tion'), string("reverse\\\\solidus", "reverse\\solidus")),
  prop(key("soli\\/dus", "soli/dus"), string("back\\bspace", "back\bspace")),
  prop(key("form\\ffeed", "form\ffeed"), string("new\\nline", "new\nline")),
  prop(key("re\\rturn", "re\rturn"), string("tab\\tsymbol", "tab\tsymbol")),
  prop(key("hex\\u0001digit", "hex\u0001digit"), string("", null)),
  prop(key('\\"\\"\\"\\"', '\"\"\"\"'), string("\\\\\\\\\\\\", "\\\\\\")),
  prop(key("\\/", "\/"), string("\\b", "\b")),
  prop(key('\\"\\/', '\"\/'), string('\\"\\\\\\/\\b\\f\\n\\r\\t\\u0001', '\"\\\/\b\f\n\r\t\u0001')),
]);

export = {
  ast: doc(ast),
  options: { verbose: false },
};
