import { queryRootNode } from "#/lib/tree-sitter/tree-sitter.ts";
import { makeTreeSitterTypeScriptClassPattern } from "#/lib/tree-sitter/tree-sitter-introspector.ts";
import {
  EXAMPLE_TYPESCRIPT_CLASS_TREE_SITTER_CAPTURE_NAME_MAP,
  EXAMPLE_TYPESCRIPT_TREE_SITTER_PARSER,
} from "./tree-sitter-parser.ts";
import type { Person } from "./person.ts";
import { EXAMPLE_PERSON } from "./person.ts";

/**
 * Book is an example class that represents a book.
 */
export class Book {
  public constructor(
    public author: Person,
  ) {}
}

/**
 * EXAMPLE_BOOK is an example instance of the Book class.
 */
export const EXAMPLE_BOOK = new Book(EXAMPLE_PERSON);

/**
 * EXAMPLE_BOOK_SOURCE_CODE is the source code of the Book class.
 */
export const EXAMPLE_BOOK_SOURCE_CODE = await Deno.readTextFile(
  new URL(import.meta.url),
);

/**
 * EXAMPLE_BOOK_TREE is a tree-sitter tree for the Book class's
 * source code.
 */
export const EXAMPLE_BOOK_TREE = EXAMPLE_TYPESCRIPT_TREE_SITTER_PARSER.parse(
  EXAMPLE_BOOK_SOURCE_CODE,
);

/**
 * EXAMPLE_BOOK_CAPTURES is a list of captures for the Book class's
 * source code.
 */
export const EXAMPLE_BOOK_CAPTURES = queryRootNode(
  EXAMPLE_BOOK_TREE,
  makeTreeSitterTypeScriptClassPattern(
    Book.name,
    EXAMPLE_TYPESCRIPT_CLASS_TREE_SITTER_CAPTURE_NAME_MAP,
  ),
);
