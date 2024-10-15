import { parserFromWasm } from "deno-tree-sitter/main.js";
import typescript from "common-tree-sitter-languages/typescript.js";
import { defaultClassTreeSitterCaptureNameMap } from "#/lib/introspector/tree-sitter-introspector.ts";

/**
 * EXAMPLE_TYPESCRIPT_TREE_SITTER_PARSER is a tree-sitter parser for TypeScript.
 */
export const EXAMPLE_TYPESCRIPT_TREE_SITTER_PARSER = await parserFromWasm(
  typescript,
);

/**
 * EXAMPLE_TYPESCRIPT_CLASS_TREE_SITTER_CAPTURE_NAME_MAP is an alias for the default class tree-sitter
 * capture name map.
 */
export const EXAMPLE_TYPESCRIPT_CLASS_TREE_SITTER_CAPTURE_NAME_MAP =
  defaultClassTreeSitterCaptureNameMap;
