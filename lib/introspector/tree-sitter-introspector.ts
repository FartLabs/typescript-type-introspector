import type {
  NamedCapture,
  Parser,
  Tree,
} from "#/lib/tree-sitter/tree-sitter.ts";
import {
  findCaptureString,
  queryRootNode,
} from "#/lib/tree-sitter/tree-sitter.ts";
import type {
  IntrospectedProperty,
  Introspection,
  Introspector,
} from "./introspector.ts";

/**
 * TreeSitterTypeScriptTypeIntrospector is a TypeScript type introspector that
 * uses Tree Sitter to introspect TypeScript types.
 */
export class TreeSitterIntrospector implements Introspector {
  public constructor(
    private readonly parser: Parser,
    private readonly nameMap: ClassTreeSitterCaptureNameMap =
      defaultClassTreeSitterCaptureNameMap,
  ) {}

  public introspectClass(
    sourceCode: string,
    identifier: string,
  ): Introspection {
    const tree = this.parser.parse(sourceCode);
    return introspectClassFromTree(tree, identifier, this.nameMap);
  }
}

/**
 * introspectClassFromTree introspects a TypeScript class's properties from a
 * Tree Sitter tree.
 */
export function introspectClassFromTree(
  tree: Tree,
  identifier: string,
  nameMap: ClassTreeSitterCaptureNameMap,
): Introspection {
  const captures = queryRootNode(
    tree,
    makeTreeSitterTypeScriptClassPattern(identifier, nameMap),
  );
  const properties = captures.map(({ captures }) =>
    introspectPropertyFromNamedCaptures(captures, nameMap)
  );

  // TODO: Introspect extends.
  return { extends: [], properties };
}

/**
 * introspectPropertyFromNamedCaptures introspects a TypeScript class property
 * from a list of named captures.
 */
export function introspectPropertyFromNamedCaptures(
  captures: NamedCapture[],
  nameMap: ClassTreeSitterCaptureNameMap,
): IntrospectedProperty {
  const propertyIdentifier = findCaptureString(
    captures,
    nameMap.PROPERTY_IDENTIFIER,
  );
  if (propertyIdentifier === undefined) {
    throw new Error("Property identifier is not defined.");
  }

  const typeAnnotation = findCaptureString(
    captures,
    nameMap.TYPE_ANNOTATION,
  )?.slice(typeScriptTypeAnnotationPrefix.length);
  if (typeAnnotation === undefined) {
    throw new Error("Type annotation is not defined.");
  }

  const fieldDefinition = findCaptureString(
    captures,
    nameMap.PUBLIC_FIELD_DEFINITION,
  );
  if (fieldDefinition === undefined) {
    throw new Error("Field definition is not defined.");
  }

  const hasQuestionToken = checkHasQuestionToken(fieldDefinition);
  return {
    name: propertyIdentifier,
    type: typeAnnotation,
    optional: hasQuestionToken,
  };
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
        value: (_)* @${nameMap.VALUE}
      ) @${nameMap.PUBLIC_FIELD_DEFINITION}

      (method_definition
        name: (property_identifier) @constructor-method
        (#eq? @constructor-method "constructor")

        parameters: (formal_parameters
          (required_parameter
            (accessibility_modifier)*
            pattern: (identifier) @${nameMap.PROPERTY_IDENTIFIER}
            type: (type_annotation)* @${nameMap.TYPE_ANNOTATION}
            value: (_)* @${nameMap.VALUE}
          ) @${nameMap.PUBLIC_FIELD_DEFINITION}
        )
      )
    ]
  )
)`;
}

/**
 * checkHasQuestionToken checks if a field definition has a question token.
 */
export function checkHasQuestionToken(fieldDefinition: string): boolean {
  const index = fieldDefinition.indexOf(":");
  return index > 0 && fieldDefinition[index - 1] === "?";
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
  "TYPE_ANNOTATION",
  "TYPE_IDENTIFIER",
  "VALUE",
] as const;
