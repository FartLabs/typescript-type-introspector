import { TSchema } from "@sinclair/typebox";
import { TypeScriptToModel } from "@sinclair/typebox-codegen";
import type {
  Capture,
  NamedCapture,
  Tree,
} from "#/lib/tree-sitter/tree-sitter.ts";
import {
  findCaptureString,
  queryRootNode,
} from "#/lib/tree-sitter/tree-sitter.ts";

/**
 * getTypeBoxSchemaFromTreeSitterTypeScriptClass gets the properties of a
 * TypeScript class via Tree Sitter and returns a TypeBox schema.
 */
export function getTypeBoxSchemaFromTreeSitterTypeScriptClass(
  tree: Tree,
  identifier: string,
  nameMap = defaultClassTreeSitterCaptureNameMap,
): TSchema {
  const captures = queryRootNode(
    tree,
    makeTreeSitterTypeScriptClassPattern(identifier, nameMap),
  );
  const interfaceCode = compileClassToInterface(captures, nameMap);
  const model = TypeScriptToModel.Generate(interfaceCode);
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
  identifier: string,
  nameMap: ClassTreeSitterCaptureNameMap,
): string {
  return `(class_declaration
  name: (type_identifier) @${nameMap.TYPE_IDENTIFIER}
  (#eq? @${nameMap.TYPE_IDENTIFIER} "${identifier}")

  body: (class_body
    [
      (public_field_definition
        (accessibility_modifier)*
        name: (property_identifier) @${nameMap.PROPERTY_IDENTIFIER}
        type: (type_annotation)* @${nameMap.TYPE_ANNOTATION}
        value: (_)* @${nameMap.VALUE}
      )

      (method_definition
        name: (property_identifier) @constructor-method
        (#eq? @constructor-method "constructor")

        parameters: (formal_parameters
          (required_parameter
            (accessibility_modifier)*
            pattern: (identifier) @${nameMap.PROPERTY_IDENTIFIER}
            type: (type_annotation)* @${nameMap.TYPE_ANNOTATION}
            value: (_)* @${nameMap.VALUE}
          )
        )
      )
    ]*
  )
)+`;
}

// TODO: Write unit tests.

/**
 * compileClassToInterface compiles the results of a Tree Sitter query on a
 * TypeScript class to a TypeScript interface.
 */
export function compileClassToInterface(
  captures: Capture[],
  nameMap: ClassTreeSitterCaptureNameMap,
): string {
  const namedCaptures = captures?.[0]?.captures;
  if (namedCaptures === undefined) {
    throw new Error("Named captures are not defined.");
  }
  const interfaceIdentifier = findCaptureString(
    namedCaptures,
    nameMap.TYPE_IDENTIFIER,
  );
  return `interface ${interfaceIdentifier} { ${
    captures
      .flatMap(
        ({ captures: namedCaptures }) =>
          compileCaptureToInterfaceField(namedCaptures, nameMap),
      )
      .join(" ")
  } }`;
}

/**
 * compileCaptureToInterfaceField compiles a TypeScript interface field from a
 * Tree Sitter capture.
 */
export function compileCaptureToInterfaceField(
  namedCaptures: NamedCapture[],
  nameMap: ClassTreeSitterCaptureNameMap,
): string {
  const propertyIdentifier = findCaptureString(
    namedCaptures,
    nameMap.PROPERTY_IDENTIFIER,
  );
  if (propertyIdentifier === undefined) {
    throw new Error("Property identifier is not defined.");
  }

  const typeAnnotation = findCaptureString(
    namedCaptures,
    nameMap.TYPE_ANNOTATION,
  )?.slice(typeScriptTypeAnnotationPrefix.length);
  if (typeAnnotation === undefined) {
    throw new Error("Type annotation is not defined.");
  }

  return `${propertyIdentifier}: ${typeAnnotation};`;
}

/**
 * typeScriptTypeAnnotationPrefix is the prefix of a TypeScript type annotation.
 */
export const typeScriptTypeAnnotationPrefix = ": ";

/**
 * defaultClassTreeSitterCaptureNameMap is the default class capture name map.
 */
export const defaultClassTreeSitterCaptureNameMap = {
  TYPE_IDENTIFIER: "type-identifier",
  PROPERTY_IDENTIFIER: "property-identifier",
  TYPE_ANNOTATION: "type-annotation",
  VALUE: "value",
} as const satisfies ClassTreeSitterCaptureNameMap;

/**
 * ClassTreeSitterCaptureNameMap is a map of class capture names to their
 * string values.
 */
export type ClassTreeSitterCaptureNameMap = {
  [name in ClassCaptureName]: string;
};

/**
 * ClassCaptureName is a class capture name.
 */
export type ClassCaptureName = typeof CLASS_CAPTURE_NAMES[number];

/**
 * CLASS_CAPTURE_NAMES is a list of class capture names.
 */
export const CLASS_CAPTURE_NAMES = [
  "PROPERTY_IDENTIFIER",
  "TYPE_ANNOTATION",
  "TYPE_IDENTIFIER",
  "VALUE",
] as const;
