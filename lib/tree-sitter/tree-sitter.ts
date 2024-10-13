import type { Tree } from "deno-tree-sitter/tree_sitter.js";

export type { Tree };

/**
 * Parser is the interface for a Tree Sitter parser.
 */
export interface Parser {
  parse(source: string): Tree;
}

/**
 * queryRootNode queries the root node of a Tree Sitter tree with a given pattern.
 */
export function queryRootNode(tree: Tree, pattern: string): Capture[] {
  return tree.rootNode.query(pattern);
}

/**
 * findCaptureString finds the string of a capture in the list of captures.
 */
export function findCaptureString(
  captures: NamedCapture[],
  captureName: string,
): string | undefined {
  const capture = captures.find((capture) => capture.name === captureName);
  if (capture === undefined) {
    return;
  }

  return getCaptureString(capture);
}

/**
 * getCaptureString gets the string of a capture.
 */
export function getCaptureString(capture: NamedCapture): string | undefined {
  return capture?.node?.text;
}

export interface Capture {
  pattern: number;
  captures: NamedCapture[];
}

/**
 * NamedCapture is the sub-capture of a capture with a name.
 */
export interface NamedCapture {
  name: string;
  node: Node;
}

export interface Node {
  type: string;
  typeId: number;
  startPosition: Position;
  startIndex: number;
  endPosition: Position;
  endIndex: number;
  indent: string;
  hasChildren: boolean;
  children: Node[];
  text?: string;
}

export interface Position {
  row: number;
  column: number;
}
