## Context

Astro compiles each `.astro` file into virtual modules identified with query
strings like `src/pages/index.astro?astro&type=style&lang.css`. When Rollup
emits those as standalone asset chunks, it runs the id through
`sanitizeFileName`, which replaces reserved characters (`?`, `&`, `=`) with
the substring `@_@`. The result: `_astro/index@_@astro.<hash>.css`.

The current build (`yarn build`) emits two such files:

- `dist/_astro/index@_@astro.pYfenLRC.css`
- `dist/_astro/about@_@astro.KPW2n5Ex.css`

Both are referenced from the generated HTML (`dist/index.html`,
`dist/about/index.html`). They load fine in dev and in a plain static
server, but the production deployment sits behind a WAF that blocks any
URL path containing `@`, so the CSS 404s and pages render unstyled.

The `@` character itself is valid in URL path segments per RFC 3986, so
this is a WAF policy constraint, not a correctness bug. We need a
filename pattern that:

1. Never contains `@`.
2. Still produces stable, content-addressed hashes (so caching works).
3. Does not collide when two different source modules would otherwise
   sanitize to the same name.

## Goals / Non-Goals

**Goals:**
- Zero files under `dist/` with `@` in the path after `yarn build`.
- Guard against regression — the build or test suite fails if any asset
  filename contains `@`.
- No change to runtime behavior, HTML structure, or caching semantics.

**Non-Goals:**
- Changing the content-hash algorithm or hash length.
- Renaming user-authored files in `public/` (those are passed through
  verbatim and should keep whatever names the author chose; a regression
  guard on `public/` would be a policy decision, not a build concern).
- Solving the general class of "characters the WAF rejects" — we only
  address `@` here. If other characters surface, extend the guard.

## Decisions

### Override Rollup's asset/chunk filename patterns

Configure `vite.build.rollupOptions.output` in `astro.config.mjs` with
`assetFileNames`, `chunkFileNames`, and `entryFileNames` that avoid
`@`. The simplest workable pattern uses `[name]` + `[hash]` with a
sanitizer applied via the function form:

```js
output: {
    assetFileNames: (info) => `_astro/${stripAt(info.name)}`,
    // similarly for chunkFileNames / entryFileNames if needed
}
```

where `stripAt` replaces the `@_@` marker (and any stray `@`) with a
safe character such as `-` or `_`. `@_@` → `--` keeps the segment
readable while guaranteeing no `@`. The content hash is unaffected
because it is derived from module content, not filename.

**Alternatives considered:**

- **Change Astro's virtual id scheme**: would require patching Astro
  core — out of scope and fragile.
- **Post-build rename pass**: walk `dist/`, rename matching files, and
  rewrite HTML/CSS references. Doable but fragile (must handle CSS
  `url(...)` references, source maps, import maps) and adds a whole
  new moving part to the build. Rejected in favor of doing it at the
  bundler layer where Vite/Rollup already handle reference rewriting.
- **Rollup's built-in `sanitizeFileName` option**: Vite already lets
  you pass `build.rollupOptions.output.sanitizeFileName`. This is the
  cleanest hook — a single function that runs for every emitted name.
  **Chosen.** It's less code than per-pattern overrides and covers
  entry/chunk/asset uniformly.

### Regression guard

Add a standalone Node script that walks `dist/` and exits non-zero
if any path contains `@`, with a descriptive error naming the
offending paths. Expose it as its own `yarn` script rather than
chaining it into `build`. Rationale: developers run `yarn build`
frequently (local dev, debugging, PoC iterations); coupling every
build to a guard is friction for a problem that only matters when
shipping to the WAF-fronted environment. Running the guard is a
one-word yarn invocation and can be triggered explicitly from CI
or before deploy.

## Risks / Trade-offs

- [Filename collisions after sanitizing] → If two modules sanitize to
  the same `[name]`, Rollup already disambiguates with the content
  hash suffix, so collisions are not a real concern.
- [Source maps reference the old name] → Vite rewrites source map
  references along with the bundle, so this is handled automatically;
  verify by spot-checking `.map` files in `dist/_astro/`.
- [Pattern drift in future Astro versions] → If Astro changes its
  virtual id scheme, our sanitizer stays correct (it only removes
  `@`); the regression guard catches any future deviation.

## Migration Plan

1. Add the `sanitizeFileName` override in `astro.config.mjs`.
2. Run `yarn build`, confirm `find dist -name '*@*'` is empty.
3. Add the regression guard (test or script).
4. Deploy to the WAF-fronted environment, confirm CSS 200s.

Rollback: revert the config change. Filenames return to `@_@` form;
works everywhere except behind the WAF.
