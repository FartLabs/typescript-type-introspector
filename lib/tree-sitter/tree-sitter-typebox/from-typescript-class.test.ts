import { assert, assertEquals } from "@std/assert";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import {
  compileClassToInterface,
  getTypeBoxSchemaFromTreeSitterTypeScriptClass,
} from "./from-typescript-class.ts";
import { EXAMPLE_TYPESCRIPT_CLASS_TREE_SITTER_CAPTURE_NAME_MAP } from "./example/tree-sitter-parser.ts";
import {
  EXAMPLE_PERSON,
  EXAMPLE_PERSON_CAPTURES,
  EXAMPLE_PERSON_INTERFACE_CODE,
  EXAMPLE_PERSON_TREE,
  Person,
} from "./example/person.ts";
import {
  EXAMPLE_BOOK_CAPTURES,
  EXAMPLE_BOOK_INTERFACE_CODE,
} from "./example/book.ts";

Deno.test("compileClassToInterface compiles a class to an interface", () => {
  const interfaceCode = compileClassToInterface(
    EXAMPLE_PERSON_CAPTURES,
    EXAMPLE_TYPESCRIPT_CLASS_TREE_SITTER_CAPTURE_NAME_MAP,
  );
  assertEquals(interfaceCode, EXAMPLE_PERSON_INTERFACE_CODE);
});

Deno.test("getTypeBoxSchemaFromTreeSitterTypeScriptClass gets the properties of a TypeScript class via Tree Sitter and returns a TypeBox schema", () => {
  const schema = getTypeBoxSchemaFromTreeSitterTypeScriptClass(
    EXAMPLE_PERSON_TREE,
    Person.name,
  );
  const typeCheck = TypeCompiler.Compile(schema);
  assert(typeCheck.Check(EXAMPLE_PERSON));
});

Deno.test("compileClassToInterface compiles a nested class to an interface", () => {
  const interfaceCode = compileClassToInterface(
    EXAMPLE_BOOK_CAPTURES,
    EXAMPLE_TYPESCRIPT_CLASS_TREE_SITTER_CAPTURE_NAME_MAP,
  );
  assertEquals(interfaceCode, EXAMPLE_BOOK_INTERFACE_CODE);
});
