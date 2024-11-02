import type { DocNode } from "@deno/doc";

/**
 * DocNodesIntrospector provides utility methods for inspecting DocNode trees.
 */
export class DocNodesIntrospector {
  public constructor(private readonly nodes: DocNode[]) {}

  /**
   * findNode finds the first node that satisfies the given predicate.
   */
  public findNode(
    fn: (node: DocNode, index?: number, obj?: DocNode[]) => boolean,
  ): DocNode | undefined {
    return this.nodes.find(fn);
  }
}
