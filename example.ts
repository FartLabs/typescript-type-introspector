import { n3 } from "#/lib/n3/mod.ts";
import { storeJSONLd } from "#/lib/store-jsonld/store-jsonld.ts";
import { EXAMPLE_TYPESCRIPT_TREE_SITTER_PARSER } from "#/fixtures/tree-sitter-parser.ts";

// deno run -A example.ts
if (import.meta.main) {
  const store = new n3.Store();
  // await storeJSONLd(store, {
  //   "@context": "http://schema.org/",
  //   "@type": "Person",
  //   "name": "Jane Doe",
  //   "jobTitle": "Professor",
  //   "telephone": "(425) 123-4567",
  //   "url": "http://www.janedoe.com",
  // });

  const { rootNode: treeSitterTree } = EXAMPLE_TYPESCRIPT_TREE_SITTER_PARSER
    .parse(await Deno.readTextFile("./fixtures/person.ts"));
  const doc = {
    ...treeSitterTree,
    "@context": {
      "@vocab": "https://tree-sitter.github.io/tree-sitter/#",
    },
    "@type": "TreeSitterTree",
  };
  await storeJSONLd(store, doc);
  await Deno.writeTextFile(
    "./person-tree.json",
    JSON.stringify(doc, null, 2),
  );

  // Read person tree from n3 store.
  const writer = new n3.Writer();
  const data = writer.quadsToString(store.getQuads(null, null, null, null));
  await Deno.writeTextFile("./person-tree.jsonld", data);

  // .getQuads(
  //   null,
  //   "https://tree-sitter.github.io/tree-sitter/#type",
  //   "TreeSitterTree",
  //   null,
  // );

  // console.log({ storedTreeSitterTree });

  // Logs all the quads in the store.
  // for (const quad of store) {
  // console.log(quad);
  // }

  // TODO: Make query on n3 store to gather semantic information.
  // Gather the class name, properties, and methods of the Person class.
}
