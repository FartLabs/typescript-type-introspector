import type { TSchema } from "@sinclair/typebox";
import { TypeScriptToModel } from "@sinclair/typebox-codegen";
import type { Introspection } from "#/lib/introspector/introspector.ts";

/**
 * schemaFromIntrospection creates a JSON schema from an introspection.
 */
export function schemaFromIntrospection(introspection: Introspection): TSchema {
  const compiledType = interfaceFromIntrospection(introspection);
  const model = TypeScriptToModel.Generate(compiledType);
  const schema = model.types[0];
  if (schema === undefined) {
    throw new Error("Schema is not defined.");
  }

  return schema;
}

/**
 * interfaceFromIntrospection creates a TypeScript interface from an introspection.
 */
export function interfaceFromIntrospection(
  introspection: Introspection,
): string {
  return `interface ${introspection.name} ${
    introspection.extends.length > 0
      ? `extends ${introspection.extends.join(", ")} `
      : ""
  }{ ${
    introspection.properties
      .map((property) =>
        `${property.name}${property.optional ? "?" : ""}: ${property.type};`
      )
      .join(" ")
  } }`;
}
