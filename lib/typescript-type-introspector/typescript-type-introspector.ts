/**
 * TypeScriptTypeIntrospector is an interface for TypeScript type introspection.
 */
export interface TypeScriptTypeIntrospector {
  getTypeOfClass(
    path: string | URL,
    className: string,
  ): TypeScriptType;
}

/**
 * TypeScriptType represents a TypeScript type.
 */
export type TypeScriptType =
  | string
  | { [propertyKey: string]: TypeScriptType };
