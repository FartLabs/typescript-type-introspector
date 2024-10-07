import type { TSchema, Type } from "@sinclair/typebox";
import type { Capture, Tree } from "./tree-sitter.ts";
// import { findNodeString } from "./tree-sitter.ts";

/**
 * typeScriptTypeAnnotationPrefix is the prefix of a TypeScript type annotation.
 */
export const typeScriptTypeAnnotationPrefix = ": ";

/**
 * getTypeBoxSchemaFromTreeSitterTypeScriptClass gets the properties of a
 * TypeScript class via Tree Sitter and returns a TypeBox schema.
 */
export function getTypeBoxSchemaFromTreeSitterTypeScriptClass(
  tree: Tree,
  className: string,
): TSchema {
  const results = tree?.rootNode.query(
    makeTreeSitterTypeScriptClassPattern(className),
  );
  throw new Error("Function not implemented.");
}

/**
 * makeTreeSitterTypeScriptClassPattern makes a Tree Sitter TypeScript class pattern
 * for a given class name to query against the Tree Sitter tree.
 */
export function makeTreeSitterTypeScriptClassPattern(
  className: string,
): string {
  return `(class_declaration
  name: (type_identifier) @type_id
  (#eq? @type_id "${className}")

  body: (class_body
    [
      (public_field_definition
        (accessibility_modifier)* @accessibility_modifier
        name: (property_identifier) @property_id
        type: (type_annotation)* @type_annotation
        value: (_)* @value
      )

      (method_definition
        name: (property_identifier) @property_id
        (#eq? @property_id "constructor")

        parameters: (formal_parameters
          (required_parameter
            (accessibility_modifier)* @accessibility_modifier
            pattern: (identifier) @pattern_id
            type: (type_annotation)* @type_annotation
            value: (_)* @value
          )
        )
      )
    ]
  )
)`;
}

// Reference:
// https://github.com/EthanThatOneKid/calendar/blob/4ee4043b79ed728db13d01c8b2db5cca2d0d6b54/lib/tree-sitter/tree-sitter-typescript.ts#L34
//