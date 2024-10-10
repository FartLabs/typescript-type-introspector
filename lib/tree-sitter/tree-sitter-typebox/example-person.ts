import { parserFromWasm } from "deno-tree-sitter/main.js";
import typescript from "common-tree-sitter-languages/typescript.js";
import { queryRootNode } from "#/lib/tree-sitter/tree-sitter.ts";
import {
  defaultClassTreeSitterCaptureNameMap,
  makeTreeSitterTypeScriptClassPattern,
} from "./from-typescript-class.ts";

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

export const EXAMPLE_PARSER = await parserFromWasm(typescript);
export const EXAMPLE_SOURCE_CODE = await Deno.readTextFile(
  new URL(import.meta.url),
);
export const EXAMPLE_TREE = EXAMPLE_PARSER.parse(EXAMPLE_SOURCE_CODE);
export const EXAMPLE_CLASS_TREE_SITTER_CAPTURE_NAME_MAP =
  defaultClassTreeSitterCaptureNameMap;
export const EXAMPLE_CAPTURES = queryRootNode(
  EXAMPLE_TREE,
  makeTreeSitterTypeScriptClassPattern(
    ExamplePerson.name,
    EXAMPLE_CLASS_TREE_SITTER_CAPTURE_NAME_MAP,
  ),
);
export const EXAMPLE_INTERFACE_CODE =
  `interface ExamplePerson { homePlanet?: string; occupation?: string; name: string; age: number; }`;
export const EXAMPLE_PERSON = new ExamplePerson("Ethan", 23);
