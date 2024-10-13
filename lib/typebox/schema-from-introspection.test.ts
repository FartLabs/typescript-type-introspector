import { assert } from "@std/assert";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import {
  EXAMPLE_PERSON,
  EXAMPLE_PERSON_INTROSPECTION,
} from "#/lib/introspector/example/person.ts";
import { schemaFromIntrospection } from "./schema-from-introspection.ts";

Deno.test("schemaFromIntrospection introspects TypeScript class", () => {
  const schema = schemaFromIntrospection(EXAMPLE_PERSON_INTROSPECTION);
  const typeCheck = TypeCompiler.Compile(schema);
  assert(typeCheck.Check(EXAMPLE_PERSON));
});
