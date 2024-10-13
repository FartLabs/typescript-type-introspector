import { assertEquals } from "@std/assert";
import { EXAMPLE_TYPESCRIPT_TREE_SITTER_PARSER } from "./example/tree-sitter-parser.ts";
import {
  EXAMPLE_PERSON_INTROSPECTION,
  EXAMPLE_PERSON_SOURCE_CODE,
  Person,
} from "./example/person.ts";
import { TreeSitterIntrospector } from "./tree-sitter-introspector.ts";

Deno.test("TreeSitterIntrospector introspects TypeScript class", () => {
  const introspector = new TreeSitterIntrospector(
    EXAMPLE_TYPESCRIPT_TREE_SITTER_PARSER,
  );
  const introspection = introspector.introspectClass(
    EXAMPLE_PERSON_SOURCE_CODE,
    Person.name,
  );
  assertEquals(introspection.extends, []);
  assertEquals(introspection.properties, EXAMPLE_PERSON_INTROSPECTION);
});
