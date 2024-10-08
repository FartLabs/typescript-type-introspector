import { parserFromWasm } from "deno-tree-sitter/main.js";
import typescript from "common-tree-sitter-languages/typescript.js";
import { TreeSitterTypeScriptTypeIntrospector } from "#/lib/typescript-type-introspector/tree-sitter-typescript-type-introspector.ts";

if (import.meta.main) {
  const parser = await parserFromWasm(typescript);
  const typeIntrospector = new TreeSitterTypeScriptTypeIntrospector(parser);
  const sourceCode = await Deno.readTextFile("./person.ts");
  const result = typeIntrospector.getTypeBoxSchemaByClass(
    sourceCode,
    "Person",
  );

  console.log({ result });
}
