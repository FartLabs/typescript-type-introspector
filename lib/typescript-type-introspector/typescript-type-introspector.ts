import type { TSchema } from "@sinclair/typebox";

/**
 * TypeScriptTypeIntrospector is an interface for TypeScript type introspection.
 */
export interface TypeScriptTypeIntrospector {
  /**
   * getTypeBoxSchemaByClass returns a TypeBox schema by TypeScript class.
   */
  getTypeBoxSchemaByClass(sourceCode: string, identifier: string): TSchema;
}
