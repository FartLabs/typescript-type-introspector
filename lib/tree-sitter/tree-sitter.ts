import type { Parser, Tree } from "deno-tree-sitter/tree_sitter.js";

export type { Parser, Tree };

/**
 * findNodeString finds the string of a node in the list of captures.
 */
export function findNodeString(
  captures: NamedCapture[],
  captureName: string,
): string | undefined {
  return captures.find((capture) => capture.name === captureName)?.node?.text;
}

export interface Capture {
  pattern: number;
  captures: NamedCapture[];
}

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
