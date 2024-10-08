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
  root: Capture[],
  nameMap: ClassTreeSitterCaptureNameMap,
): string {
  // TODO: handle root captures.
  // https://pastebin.com/m9KGwMvE
  //

  // console.log({ root });
  const interfaceIdentifier = findCaptureString(
    root[0].captures,
    nameMap.TYPE_IDENTIFIER,
  );
  return `interface ${interfaceIdentifier} { ${
    root[0].captures
      // TODO: Fix implementation of function compileCaptureToInterfaceField.
      .map((capture) => compileCaptureToInterfaceField(capture, nameMap))
      .join(" ")
  } }`;

  // TODO: Fix.
  throw new Error("Not implemented.");
}

/**
 * compileCaptureToInterfaceField compiles a TypeScript interface field from a
 * Tree Sitter capture.
 */
export function compileCaptureToInterfaceField(
  captures: NamedCapture[],
  nameMap: ClassTreeSitterCaptureNameMap,
): string {
  console.log({ captures });

  const typeAnnotation = findCaptureString(
    captures,
    nameMap.TYPE_ANNOTATION,
  )?.slice(typeScriptTypeAnnotationPrefix.length);
  if (typeAnnotation === undefined) {
    throw new Error("Type annotation is not defined.");
  }

  console.log({ typeAnnotation });

  // My brain feels sorta fried 😵‍💫

  throw new Error("Not implemented.");

  // return `${capture.name}: ${typeAnnotation};`;
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
