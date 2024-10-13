/**
 * Introspector is an interface for TypeScript type introspection.
 */
export interface Introspector {
  /**
   * introspectClass introspects a TypeScript class's properties.
   */
  introspectClass(sourceCode: string, identifier: string): Introspection;
}

/**
 * Introspection is a TypeScript class introspection.
 */
export interface Introspection {
  name: string;
  extends: string[];
  properties: IntrospectedProperty[];
}

/**
 * IntrospectedProperty is a TypeScript class property introspection.
 */
export interface IntrospectedProperty {
  name: string;
  type: string;
  optional: boolean;
}
