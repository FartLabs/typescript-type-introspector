import { fromJSONLd } from "#/lib/from-jsonld/from-jsonld.ts";

const doc = {
  "@context": {
    "name": "http://schema.org/name",
    "description": "http://schema.org/description",
  },
  "@id": "http://example.org",
  "name": "Example",
  "description": "An example document.",
};

// deno run -A example.ts
if (import.meta.main) {
  const nquads = await fromJSONLd(doc);
  console.log({ nquads });
}
