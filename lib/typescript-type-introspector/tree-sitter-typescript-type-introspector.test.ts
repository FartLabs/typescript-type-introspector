import { assert } from "@std/assert";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import {
  EXAMPLE_PARSER,
  EXAMPLE_PERSON,
  EXAMPLE_SOURCE_CODE,
  ExamplePerson,
} from "#/lib/tree-sitter/tree-sitter-typebox/example-person.ts";
import { TreeSitterTypeScriptTypeIntrospector } from "./tree-sitter-typescript-type-introspector.ts";

Deno.test("TreeSitterTypeScriptTypeIntrospector introspects TypeScript class", () => {
  const typeIntrospector = new TreeSitterTypeScriptTypeIntrospector(
    EXAMPLE_PARSER,
  );
  const schema = typeIntrospector.getTypeBoxSchemaByClass(
    EXAMPLE_SOURCE_CODE,
    ExamplePerson.name,
  );
  const typeCheck = TypeCompiler.Compile(schema);
  assert(typeCheck.Check(EXAMPLE_PERSON));
});
