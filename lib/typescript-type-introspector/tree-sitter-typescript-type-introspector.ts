import type { TSchema } from "@sinclair/typebox";
import type { Parser } from "#/lib/tree-sitter/tree-sitter.ts";
import { getTypeBoxSchemaFromTreeSitterTypeScriptClass } from "#/lib/tree-sitter/tree-sitter-typebox/from-typescript-class.ts";
import type { TypeScriptTypeIntrospector } from "./typescript-type-introspector.ts";

/**
 * TreeSitterTypeScriptTypeIntrospector is a TypeScript type introspector that
 * uses Tree Sitter to introspect TypeScript types.
 */
export class TreeSitterTypeScriptTypeIntrospector
  implements TypeScriptTypeIntrospector {
  public constructor(private readonly parser: Parser) {}

  public getTypeBoxSchemaByClass(
    sourceCode: string,
    identifier: string,
  ): TSchema {
    const tree = this.parser.parse(sourceCode);
    return getTypeBoxSchemaFromTreeSitterTypeScriptClass(tree, identifier);
  }
}
