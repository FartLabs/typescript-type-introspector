if (import.meta.main) {
  const cacheSubcommand = makeCacheSubcommand({
    "https://deno.land/x/deno_tree_sitter@0.2.5.2/": [
      "tree_sitter.wasm.binaryified.js",
      "tree_sitter.js",
      "main.js",
    ],
    "https://github.com/jeff-hykin/common_tree_sitter_languages/raw/e0395e3a6e552b0fa73500d5b724735a52936067/main/":
      ["typescript.js"],
  });

  const cacheSubcommandOutput = await cacheSubcommand.output();
  if (!cacheSubcommandOutput.success) {
    Deno.exit(1);
  }
}

export function makeCacheSubcommand(
  httpsImports: Record<string, string[]>,
): Deno.Command {
  return new Deno.Command(
    Deno.execPath(),
    {
      args: [
        "cache",
        ...Object.entries(httpsImports)
          .flatMap(([url, paths]) => paths.map((path) => `${url}${path}`)),
      ],
    },
  );
}
