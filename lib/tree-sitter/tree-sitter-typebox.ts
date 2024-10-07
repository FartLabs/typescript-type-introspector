import { TSchema } from "@sinclair/typebox";
import { TypeScriptToModel } from "@sinclair/typebox-codegen";
import type { Capture, Tree } from "./tree-sitter.ts";
import { findNodeString } from "./tree-sitter.ts";

/**
 * getTypeBoxSchemaFromTreeSitterTypeScriptClass gets the properties of a
 * TypeScript class via Tree Sitter and returns a TypeBox schema.
 */
export function getTypeBoxSchemaFromTreeSitterTypeScriptClass(
  tree: Tree,
  className: string,
): TSchema {
  const model = TypeScriptToModel.Generate(
    compileClassToInterface(
      tree?.rootNode.query(
        makeTreeSitterTypeScriptClassPattern(className),
      ),
    ),
  );
  const schema = model.types[0];
  if (schema === undefined) {
    throw new Error("Schema is not defined.");
  }

  return schema;
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

/**
 * compileClassToInterface compiles a TypeScript interface from the results of
 * a Tree Sitter query on a TypeScript class.
 */
export function compileClassToInterface(
  captures: Capture[],
): string {
  const typeIdentifier = findNodeString(captures, "type_id");
  if (typeIdentifier === undefined) {
    throw new Error("Type identifier is not defined.");
  }

  return `interface ${typeIdentifier} {
    ${
    captures
      .map((capture) => compileCaptureToInterfaceField(capture))
      .join("\n")
  }
}`;
}

/**
 * compileCaptureToInterfaceField compiles a TypeScript interface field from a
 * Tree Sitter capture.
 */
export function compileCaptureToInterfaceField(
  capture: Capture,
): string {
  const typeAnnotation = findNodeString(
    capture.node.children,
    "type_annotation",
  )?.slice(typeScriptTypeAnnotationPrefix.length);
  if (typeAnnotation === undefined) {
    throw new Error("Type annotation is not defined.");
  }

  return `${capture.name}: ${typeAnnotation};`;
}

/**
 * typeScriptTypeAnnotationPrefix is the prefix of a TypeScript type annotation.
 */
export const typeScriptTypeAnnotationPrefix = ": ";
