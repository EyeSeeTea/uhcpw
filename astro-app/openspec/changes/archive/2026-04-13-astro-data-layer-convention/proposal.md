## Why

The about page follows a clean data layer convention: page frontmatter calls a `get*PageData()` function from `src/data/<feature>/`, which internally calls the composition root, transforms data, and returns a typed result. But the methods page bypasses this — it calls `getServerCompositionRoot()` and `runFuture()` directly in the `.astro` frontmatter.

This inconsistency will compound as more pages are migrated. Without a clear, enforced convention, each page will reinvent its own data-fetching pattern, making the codebase harder to navigate, test, and refactor.

## What Changes

- Create a `src/data/methods/methods-data.ts` module following the same pattern as `src/data/about/about-data.ts`.
- Refactor `methods.astro` to call the new data module instead of the composition root directly.
- Document the data layer convention in `AGENTS.md` (for AI agents) and `CLAUDE.md` (for enforcement).
- Add an ESLint rule to prevent `.astro` files from importing `composition-root.server` or `future-bridge` directly — enforcing that all data access goes through `src/data/`.

## Capabilities

### Modified Capabilities

- `methods-data-fetching`: Methods page data fetching moves from inline frontmatter to a dedicated data module, consistent with the about page pattern.

## Impact

- **Refactored files**: `src/pages/methods.astro` (simpler frontmatter), new `src/data/methods/methods-data.ts`.
- **Documentation**: `AGENTS.md` updated with explicit data layer convention. `CLAUDE.md` updated with enforcement rule.
- **Lint rules**: New ESLint restriction preventing `.astro` files from importing infra modules directly.
- **Refactored files**: `src/data/about/about-data.ts` absorbs image download orchestration from `about.astro`, `src/pages/about.astro` simplified frontmatter.
- **No behavior change**: All pages render identically — this is a structural refactor only.

## Non-goals

- Refactoring other pages (home, regions, etc.) — they'll follow the convention when migrated.
- Adding tests for the methods data module — the data fetching is a trivial pass-through with no transformation logic. Tests would only assert that the composition root was called, which is not valuable.
- Changing the composition root or future bridge themselves.
