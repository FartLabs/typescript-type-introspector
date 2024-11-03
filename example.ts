import { n3 } from "#/lib/n3/mod.ts";
import { storeJSONLd } from "#/lib/store-jsonld/mod.ts";

// deno run -A example.ts
if (import.meta.main) {
  const store = new n3.Store();
  await storeJSONLd(store, {
    "@context": "http://schema.org/",
    "@type": "Person",
    "name": "Jane Doe",
    "jobTitle": "Professor",
    "telephone": "(425) 123-4567",
    "url": "http://www.janedoe.com",
  });

  // Logs all the quads in the store.
  for (const quad of store) {
    console.log(quad);
  }
}
