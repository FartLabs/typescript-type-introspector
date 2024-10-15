import { assertEquals } from "@std/assert";
import { TreeSitterIntrospector } from "#/lib/introspector/tree-sitter-introspector.ts";
import { EXAMPLE_TYPESCRIPT_TREE_SITTER_PARSER } from "../lib/example/tree-sitter-parser.ts";
import {
  EXAMPLE_PERSON_INTROSPECTION,
  EXAMPLE_PERSON_SOURCE_CODE,
  Person,
} from "#/lib/example/person.ts";

Deno.test("TreeSitterIntrospector introspects TypeScript class", () => {
  const introspector = new TreeSitterIntrospector(
    EXAMPLE_TYPESCRIPT_TREE_SITTER_PARSER,
  );
  const introspection = introspector.introspectClass(
    EXAMPLE_PERSON_SOURCE_CODE,
    Person.name,
  );
  assertEquals(introspection, EXAMPLE_PERSON_INTROSPECTION);
});
