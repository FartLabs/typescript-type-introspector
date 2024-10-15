# typescript-type-introspection

Reason with TypeScript code via
[_type introspection_](https://en.wikipedia.org/wiki/Type_introspection),
powered by [Tree-Sitter](https://tree-sitter.github.io/tree-sitter/).

## Introspection

Introspection helps avoid the problem of slow types introduced by libraries like
Zod and TypeBox. It allows you to determine the type of a value at runtime,
rather than inferring it at compile time. This can lead to more efficient and
dynamic type handling in your TypeScript projects.

## Installation

```sh
deno add @fartlabs/typescript-type-introspection
```

## TypeBox

> TypeBox objects are JSON Schema objects with extra in-memory magic!
>
> A fun way to think about TypeBox is that it does for JSON Schema what drizzle
> does for SQL - it’s a nice, TypeScript-friendly builder syntax for an existing
> spec that tries to expose all of the spec’s power. That’s not all TypeBox is -
> it has an extremely fast built-in type checker, it can create example values
> based on schemas, and a lot more.
>
> \- <https://blog.val.town/blog/typebox/>

Introspection helps avoid the problem of slow types introduced by libraries like
Zod and TypeBox. It allows you to determine the type of a value at runtime,
rather than inferring it at compile time. This can lead to more efficient and
dynamic type handling in your TypeScript projects.

### TypeBox example

Instantiate a TypeBox schema at runtime using introspection via
`@sinclair/typebox/compiler`.

<https://github.com/FartLabs/typescript-type-introspector/blob/971282f7ff863a84cb43af1e1725961c62cc54b3/examples/schema-from-introspection.test.ts#L1-L13>

## Development

Make sure to install Deno:
<https://deno.land/manual/getting_started/installation>.

Run the tests:

```sh
deno task dev
```

Format the project:

```sh
deno fmt
```

Check for common errors:

```sh
deno lint
```

---

Developed with 🧪 [**@FartLabs**](https://github.com/FartLabs)
