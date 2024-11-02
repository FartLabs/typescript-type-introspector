import type { ClassDef } from "@deno/doc";

/**
 * Introspector is an interface for TypeScript type introspection.
 */
export interface Introspector {
  /**
   * introspectClass introspects a TypeScript class definition.
   */
  introspectClass(specifier: string, identifier: string): ClassDef;
}

// TODO: Figure out how to introspect a TypeScript class definition.
// Generate TypeBox schema from TypeScript class definition or interface definition.
