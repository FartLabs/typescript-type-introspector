import { JsonLdParser } from "jsonld-streaming-parser";
import { promisifyEventEmitter } from "event-emitter-promisify";
import { n3 } from "#/lib/n3/mod.ts";

/**
 * storeJSONLd stores a JSON-LD document in a N3 store.
 *
 * @see
 * https://github.com/rubensworks/jsonld-streaming-parser.js/blob/b55134f2c5c938c3cdf73981667ce090655dff9b/README.md#convert-a-json-ld-string-to-an-rdfjs-dataset
 */
export async function storeJSONLd(
  store: n3.Store,
  doc: unknown,
): Promise<void> {
  const parser = new JsonLdParser();
  parser.write(JSON.stringify(doc));
  parser.end();
  await promisifyEventEmitter(store.import(parser));
}
