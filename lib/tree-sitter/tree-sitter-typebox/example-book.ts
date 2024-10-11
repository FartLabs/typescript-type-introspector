import { queryRootNode } from "#/lib/tree-sitter/tree-sitter.ts";
import {
  EXAMPLE_TYPESCRIPT_CLASS_TREE_SITTER_CAPTURE_NAME_MAP,
  EXAMPLE_TYPESCRIPT_TREE_SITTER_PARSER,
} from "./example-tree-sitter-parser.ts";
import { EXAMPLE_PERSON, ExamplePerson } from "./example-person.ts";
import { makeTreeSitterTypeScriptClassPattern } from "./from-typescript-class.ts";

/**
 * ExampleBook is an example class that represents a book.
 */
export class ExampleBook {
  public constructor(
    public author: ExamplePerson,
  ) {}
}

/**
 * EXAMPLE_BOOK is an example instance of the ExampleBook class.
 */
export const EXAMPLE_BOOK = new ExampleBook(EXAMPLE_PERSON);

/**
 * EXAMPLE_BOOK_SOURCE_CODE is the source code of the ExampleBook class.
 */
export const EXAMPLE_BOOK_SOURCE_CODE = await Deno.readTextFile(
  new URL(import.meta.url),
);

/**
 * EXAMPLE_BOOK_TREE is a tree-sitter tree for the ExampleBook class's
 * source code.
 */
export const EXAMPLE_BOOK_TREE = EXAMPLE_TYPESCRIPT_TREE_SITTER_PARSER.parse(
  EXAMPLE_BOOK_SOURCE_CODE,
);

/**
 * EXAMPLE_BOOK_CAPTURES is a list of captures for the ExampleBook class's
 * source code.
 */
export const EXAMPLE_BOOK_CAPTURES = queryRootNode(
  EXAMPLE_BOOK_TREE,
  makeTreeSitterTypeScriptClassPattern(
    ExampleBook.name,
    EXAMPLE_TYPESCRIPT_CLASS_TREE_SITTER_CAPTURE_NAME_MAP,
  ),
);

/**
 * EXAMPLE_BOOK_INTERFACE_CODE is the TypeScript interface code for the
 * ExampleBook class.
 */
export const EXAMPLE_BOOK_INTERFACE_CODE =
  `interface ExampleBook { author: ExamplePerson; }`;
