import type { Node, Parser, Tree } from "deno-tree-sitter/tree_sitter.js";

export type { Node, Parser, Tree };

/**
 * Capture is a named node in the tree.
 */
export interface Capture {
  name: string;
  node: Node;
}

/**
 * findNodeString finds the string of a node in the list of captures.
 */
export function findNodeString(
  captures: Capture[],
  name: string,
): string | undefined {
  return captures.find((capture) => capture.name === name)?.node?.text;
}
