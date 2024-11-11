import { queryRootNode } from "#/lib/tree-sitter/tree-sitter.ts";
import type { Introspection } from "#/lib/introspector/introspector.ts";
import { makeTreeSitterTypeScriptClassPattern } from "#/lib/tree-sitter/tree-sitter-introspector.ts";
import {
  EXAMPLE_TYPESCRIPT_CLASS_TREE_SITTER_CAPTURE_NAME_MAP,
  EXAMPLE_TYPESCRIPT_TREE_SITTER_PARSER,
} from "./tree-sitter-parser.ts";

/**
 * Person is an example class that represents a person.
 */
export class Person {
  public homePlanet?: string = "Earth";
  public occupation?: string = "Software Engineer";

  public constructor(
    public name: string,
    public age: number,
  ) {}
}

/**
 * EXAMPLE_PERSON is an example instance of the Person class.
 */
export const EXAMPLE_PERSON = new Person("Ethan", 23);

/**
 * EXAMPLE_PERSON_INTROSPECTION is the introspection of the Person class.
 */
export const EXAMPLE_PERSON_INTROSPECTION = {
  extends: [],
  name: "Person",
  properties: [
    {
      name: "homePlanet",
      optional: true,
      type: "string",
    },
    {
      name: "occupation",
      optional: true,
      type: "string",
    },
    {
      name: "name",
      optional: false,
      type: "string",
    },
    {
      name: "age",
      optional: false,
      type: "number",
    },
  ],
} as const satisfies Introspection;

/**
 * EXAMPLE_PERSON_SOURCE_CODE is the source code of the Person class.
 */
export const EXAMPLE_PERSON_SOURCE_CODE = await Deno.readTextFile(
  new URL(import.meta.url),
);

/**
 * EXAMPLE_PERSON_TREE is a tree-sitter tree for the Person class's
 * source code.
 */
export const EXAMPLE_PERSON_TREE = EXAMPLE_TYPESCRIPT_TREE_SITTER_PARSER.parse(
  EXAMPLE_PERSON_SOURCE_CODE,
);

/**
 * EXAMPLE_PERSON_CAPTURES is a list of captures for the Person class's
 * source code.
 */
export const EXAMPLE_PERSON_CAPTURES = queryRootNode(
  EXAMPLE_PERSON_TREE,
  makeTreeSitterTypeScriptClassPattern(
    Person.name,
    EXAMPLE_TYPESCRIPT_CLASS_TREE_SITTER_CAPTURE_NAME_MAP,
  ),
);
