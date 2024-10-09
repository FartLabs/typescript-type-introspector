import { parserFromWasm } from "deno-tree-sitter/main.js";
import typescript from "common-tree-sitter-languages/typescript.js";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import { TreeSitterTypeScriptTypeIntrospector } from "#/lib/typescript-type-introspector/tree-sitter-typescript-type-introspector.ts";

if (import.meta.main) {
  const parser = await parserFromWasm(typescript);
  const typeIntrospector = new TreeSitterTypeScriptTypeIntrospector(parser);
  const sourceCode = await Deno.readTextFile("./person.ts");
  const schema = typeIntrospector.getTypeBoxSchemaByClass(
    sourceCode,
    "Person",
  );
  const checker = TypeCompiler.Compile(schema);
  const result = checker.Check({
    occupation: "Software Engineer",
  });

  console.log({ result, schema });
}
