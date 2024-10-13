import { assert } from "@std/assert";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import { EXAMPLE_TYPESCRIPT_TREE_SITTER_PARSER } from "../tree-sitter/tree-sitter-typebox/example/tree-sitter-parser.ts";
import {
  EXAMPLE_PERSON,
  EXAMPLE_PERSON_SOURCE_CODE,
  Person,
} from "#/lib/tree-sitter/tree-sitter-typebox/example/person.ts";
import { TreeSitterTypeScriptTypeIntrospector } from "./tree-sitter-typescript-type-introspector.ts";

Deno.test("TreeSitterTypeScriptTypeIntrospector introspects TypeScript class", () => {
  const typeIntrospector = new TreeSitterTypeScriptTypeIntrospector(
    EXAMPLE_TYPESCRIPT_TREE_SITTER_PARSER,
  );
  const schema = typeIntrospector.getTypeBoxSchemaByClass(
    EXAMPLE_PERSON_SOURCE_CODE,
    Person.name,
  );
  const typeCheck = TypeCompiler.Compile(schema);
  assert(typeCheck.Check(EXAMPLE_PERSON));
});
