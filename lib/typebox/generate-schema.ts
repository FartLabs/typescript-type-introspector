import type { DocNode } from "@deno/doc";
import { doc } from "@deno/doc";
import { TypeScriptToTypeBox } from "@sinclair/typebox-codegen";

export function generateSchema(docNode: DocNode): string {
  const docNodeSource = Deno.readTextFileSync(docNode.location.filename);
  console.log(docNodeSource);

  return "";
}

// deno run -A lib/typebox/generate-schema.ts
if (import.meta.main) {
  const docNodes = await doc(import.meta.resolve("./example.ts"));

  console.log(docNodes);
}
