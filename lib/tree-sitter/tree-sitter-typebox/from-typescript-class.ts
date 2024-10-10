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
 * fromTypeScriptClass is an alias for
 * `getTypeBoxSchemaFromTreeSitterTypeScriptClass`.
 *
 * @see {@link getTypeBoxSchemaFromTreeSitterTypeScriptClass}
 */
export const fromTypeScriptClass =
  getTypeBoxSchemaFromTreeSitterTypeScriptClass;

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
 * makeTreeSitterTypeScriptClassPattern makes a Tree Sitter TypeScript class
 * pattern for a given class name to query against the Tree Sitter tree.
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
        value: (_) @${nameMap.VALUE}
      ) @${nameMap.PUBLIC_FIELD_DEFINITION}

      (method_definition
        name: (property_identifier) @constructor-method
        (#eq? @constructor-method "constructor")
        parameters: (formal_parameters
          (required_parameter
            (accessibility_modifier)*
            pattern: (identifier) @${nameMap.PROPERTY_IDENTIFIER}
            type: (type_annotation)* @${nameMap.TYPE_ANNOTATION}
            value: (_) @${nameMap.VALUE}
          ) @${nameMap.REQUIRED_PARAMETER}
        )
      )
    ]+
  )
)`;
}

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

  const fieldDefinition = findCaptureString(
    namedCaptures,
    nameMap.PUBLIC_FIELD_DEFINITION,
  ) ?? findCaptureString(namedCaptures, nameMap.REQUIRED_PARAMETER);
  if (fieldDefinition === undefined) {
    throw new Error("Field definition is not defined.");
  }

  const hasQuestionToken = checkHasQuestionToken(fieldDefinition);
  return `${propertyIdentifier}${
    hasQuestionToken ? "?" : ""
  }: ${typeAnnotation};`;
}

/**
 * checkHasQuestionToken checks if a field definition has a question token.
 */
export function checkHasQuestionToken(fieldDefinition: string): boolean {
  const index = fieldDefinition.indexOf(":");
  if (index === -1) {
    return false;
  }

  return fieldDefinition.at(fieldDefinition.indexOf(":") - 1) === "?";
}

/**
 * compileJSDocCommentDefault compiles a JSDoc comment with a default value.
 * @see
 * https://github.com/xddq/ts2typebox/blob/30116d7ff816b2d838d5dc5b757df6151632ef11/README.md#examples
 */
export function compileJSDocCommentDefault(defaultValue: string): string {
  return `/** @default ${defaultValue} */`;
}

/**
 * typeScriptTypeAnnotationPrefix is the prefix of a TypeScript type annotation.
 */
export const typeScriptTypeAnnotationPrefix = ": ";

/**
 * defaultClassTreeSitterCaptureNameMap is the default class capture name map.
 */
export const defaultClassTreeSitterCaptureNameMap = {
  PROPERTY_IDENTIFIER: "property-identifier",
  PUBLIC_FIELD_DEFINITION: "public-field-definition",
  REQUIRED_PARAMETER: "required-parameter",
  TYPE_ANNOTATION: "type-annotation",
  TYPE_IDENTIFIER: "type-identifier",
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
  "PUBLIC_FIELD_DEFINITION",
  "REQUIRED_PARAMETER",
  "TYPE_ANNOTATION",
  "TYPE_IDENTIFIER",
  "VALUE",
] as const;
