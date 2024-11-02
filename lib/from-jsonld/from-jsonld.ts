import { jsonld } from "#/lib/jsonld/mod.ts";
import { n3 } from "#/lib/n3/mod.ts";

const parser = new n3.Parser({ format: "application/n-quads" });
const writer = new n3.Writer({ format: "application/trig" });

// TODO: https://github.com/rubensworks/jsonld-streaming-parser.js#convert-a-json-ld-string-to-an-rdfjs-dataset

/**
 * fromJSONLd converts a JSON-LD document to a N-Quads string.
 *
 * @see
 * https://gist.github.com/EmmanuelOga/a6555bc475a8291e70c96105e60c87b7
 */
export function fromJSONLd(doc: jsonld.JsonLdDocument): Promise<string> {
  return new Promise((resolve, reject) =>
    jsonld.toRDF(doc, { format: "application/n-quads" })
      .then((nquads) =>
        parser.parse(nquads, (error, quad, _prefixes) => {
          if (error) {
            reject(error);
            return;
          }

          writer.addQuad(quad);
        })
      )
      .then(() =>
        writer.end((error, result) => {
          if (error) {
            reject(error);
            return;
          }

          resolve(result);
        })
      )
  );
}
