# asset-naming Specification

## Purpose
TBD - created by archiving change no-at-in-asset-names. Update Purpose after archive.
## Requirements
### Requirement: No `@` in emitted asset paths

The production build (`yarn build`) SHALL NOT emit any file under the
output directory (`dist/`) whose path — directory or filename — contains
the `@` character. This applies to all bundler-generated artifacts
(JS chunks, CSS chunks, entry files, source maps, and other emitted
assets). Files copied verbatim from `public/` are out of scope and
remain the author's responsibility.

The constraint exists because the target deployment sits behind a WAF
that rejects URLs containing `@`; any emitted asset with `@` in its
path is unreachable in production.

#### Scenario: Clean production build

- **WHEN** `yarn build` completes successfully
- **THEN** `find dist -name '*@*' -not -path 'dist/public/*'` returns
  zero results

#### Scenario: Astro scoped CSS chunks

- **WHEN** the build emits a scoped CSS chunk from an `.astro` page
  (virtual id like `index.astro?astro&type=style`)
- **THEN** the emitted filename MUST NOT contain `@` (the default
  `@_@` marker Rollup inserts when sanitizing `?`/`&`/`=` characters
  MUST be replaced with a WAF-safe substitute)

### Requirement: Asset-name regression guard

The repository SHALL provide a standalone check, runnable on demand,
that exits non-zero when any emitted asset path in `dist/` contains
`@`. The check MUST be exposed as its own script so it can be invoked
independently of `yarn build` (e.g. in CI after a build artifact has
been produced, or locally against an existing `dist/`) without
coupling every developer build to it.

#### Scenario: Guard detects regression

- **WHEN** `dist/` contains a file such as `_astro/foo@_@astro.abc.css`
- **AND** the standalone guard script is invoked
- **THEN** it MUST exit non-zero with an error message that names the
  offending path(s)

#### Scenario: Guard passes on clean build

- **WHEN** `dist/` contains no paths with `@`
- **AND** the standalone guard script is invoked
- **THEN** it MUST exit zero with no error

