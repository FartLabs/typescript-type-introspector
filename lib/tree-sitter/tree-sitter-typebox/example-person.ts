import { queryRootNode } from "#/lib/tree-sitter/tree-sitter.ts";
import { makeTreeSitterTypeScriptClassPattern } from "./from-typescript-class.ts";
import {
  EXAMPLE_TYPESCRIPT_CLASS_TREE_SITTER_CAPTURE_NAME_MAP,
  EXAMPLE_TYPESCRIPT_TREE_SITTER_PARSER,
} from "./example-tree-sitter-parser.ts";

/**
 * ExamplePerson is an example class that represents a person.
 */
export class ExamplePerson {
  public homePlanet?: string = "Earth";
  public occupation?: string = "Software Engineer";

  public constructor(
    public name: string,
    public age: number,
  ) {}
}

/**
 * EXAMPLE_PERSON is an example instance of the ExamplePerson class.
 */
export const EXAMPLE_PERSON = new ExamplePerson("Ethan", 23);

/**
 * EXAMPLE_PERSON_SOURCE_CODE is the source code of the ExamplePerson class.
 */
export const EXAMPLE_PERSON_SOURCE_CODE = await Deno.readTextFile(
  new URL(import.meta.url),
);

/**
 * EXAMPLE_PERSON_TREE is a tree-sitter tree for the ExamplePerson class's
 * source code.
 */
export const EXAMPLE_PERSON_TREE = EXAMPLE_TYPESCRIPT_TREE_SITTER_PARSER.parse(
  EXAMPLE_PERSON_SOURCE_CODE,
);

/**
 * EXAMPLE_PERSON_CAPTURES is a list of captures for the ExamplePerson class's
 * source code.
 */
export const EXAMPLE_PERSON_CAPTURES = queryRootNode(
  EXAMPLE_PERSON_TREE,
  makeTreeSitterTypeScriptClassPattern(
    ExamplePerson.name,
    EXAMPLE_TYPESCRIPT_CLASS_TREE_SITTER_CAPTURE_NAME_MAP,
  ),
);

/**
 * EXAMPLE_PERSON_INTERFACE_CODE is the TypeScript interface code for the
 * ExamplePerson class.
 */
export const EXAMPLE_PERSON_INTERFACE_CODE =
  `interface ExamplePerson { homePlanet?: string; occupation?: string; name: string; age: number; }`;
