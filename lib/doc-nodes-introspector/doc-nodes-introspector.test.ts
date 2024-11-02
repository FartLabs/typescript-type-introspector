import { assertEquals } from "@std/assert";
import { DocNodesIntrospector } from "./doc-nodes-introspector.ts";

const fakeIntrospector = new DocNodesIntrospector([
  {
    kind: "variable",
    declarationKind: "export",
    name: "foo",
    variableDef: { kind: "const" },
    location: {
      line: 1,
      col: 1,
      filename: "foo.ts",
    },
  },
]);

Deno.test("DocNodesIntrospector#findNode finds the first node that satisfies the given predicate", () => {
  const node = fakeIntrospector.findNode((node) => node.name === "foo");
  assertEquals(node?.name, "foo");
});

Deno.test("DocNodesIntrospector#findNode returns undefined if no node satisfies the given predicate", () => {
  const node = fakeIntrospector.findNode((node) => node.name === "bar");
  assertEquals(node, undefined);
});
