import { Store } from "n3";
import { JsonLdParser } from "jsonld-streaming-parser";
import { promisifyEventEmitter } from "event-emitter-promisify";

const doc = {
  "@context": "http://schema.org/",
  "@type": "Person",
  "name": "Jane Doe",
  "jobTitle": "Professor",
  "telephone": "(425) 123-4567",
  "url": "http://www.janedoe.com",
};

// deno run -A example.ts
if (import.meta.main) {
  const store = new Store();
  const parser = new JsonLdParser();
  parser.write(JSON.stringify(doc));
  parser.end();
  await promisifyEventEmitter(store.import(parser));

  // Logs all the quads in the store
  console.log(...store);
}
