## Context

The astro-app `src/` directory grew organically during the PoC phase. `components/` was structured by feature from the start (`about/`, `layout/`, `seo/`), but `lib/` became a flat catch-all for everything else. With 3 pages implemented and more coming, the cost of restructuring only grows.

Current data flow through architecture layers:
```
Pages (.astro)
  → import data functions from lib/ (about-data.ts, about-images.ts)
    → which use composition-root.server.ts to get the D2 API
    → which use future-bridge.ts to convert Futures to Promises
    → which call shared domain use cases via @shared/
  → pass data as props to Components (.astro) and Islands (.tsx)
```

This flow doesn't change — only where the files live.

## Goals / Non-Goals

**Goals:**
- Each directory under `src/` has a single, clear purpose
- New contributors can infer where to put new files by looking at the structure
- Test convention is consistent and matches the parent React SPA project
- AGENTS.md documents the conventions for AI-assisted development

**Non-Goals:**
- Refactoring any logic or APIs
- Changing build output or runtime behavior
- Adding barrel files (index.ts re-exports) — direct imports are fine at this scale
- Introducing path aliases for the new directories (existing `@shared/` alias is unaffected)

## Decisions

### 1. Three-way split of lib/ → data/, infra/, lib/

**Choice**: Top-level `data/`, `infra/`, and slimmed `lib/`.

**Why not subdirectories of lib/?** (`lib/data/`, `lib/infra/`): The whole point is that `lib/` lost its meaning. Keeping everything under `lib/` preserves the ambiguity. Top-level directories make the separation visible in the file tree.

**Why not a single `utils/` rename?** Doesn't solve the problem — just renames the junk drawer.

**Classification rule:**
| Directory | Contains | Example |
|-----------|----------|---------|
| `data/<feature>/` | Page-specific data fetching, shaping, validation | `data/about/about-data.ts` |
| `infra/` | Framework glue, API initialization, adapter patterns | `infra/composition-root.server.ts` |
| `lib/` | Generic utilities with no domain knowledge | `lib/markdown.ts` |

### 2. `__tests__/` subfolder convention

**Choice**: All tests in `__tests__/` subfolders, not colocated siblings.

**Why**: Parent React SPA uses `__tests__/`. Consistency across the monorepo reduces cognitive overhead. The Vitest config already resolves `**/__tests__/**` patterns.

### 3. Feature-based islands grouping

**Choice**: `islands/about/` now, even with only 2 files.

**Why**: Matches `components/about/` pattern. When methods page gets islands, `islands/methods/` slots in naturally. Cost of moving 2 files now is trivial; cost of moving 20 files later is not.

### 4. No barrel files

**Choice**: Import directly from file paths, no `index.ts` re-exports.

**Why**: At this scale, barrel files add indirection without benefit. Direct imports make it obvious where code lives. Can revisit if a directory grows past ~8 modules.

## Data flow (after restructuring)

```
Pages (.astro)
  → import from data/about/  (about-data.ts, about-images.ts)
    → import from infra/     (composition-root.server.ts)
    → import from infra/     (future-bridge.ts)
    → call @shared/ domain use cases
  → pass props to components/about/ (.astro) and islands/about/ (.tsx)
```

## Risks / Trade-offs

- **[Risk] Stale imports in IDE caches** → Run `yarn astro check` and `yarn test` after all moves to catch any broken imports. TypeScript will surface these at compile time.
- **[Risk] Git blame loses history on moved files** → Use `git mv` for each file so `git log --follow` continues to work.
- **[Trade-off] More top-level directories** → `src/` goes from 8 to 10 top-level entries. Acceptable given each has a clear single purpose.
- **[Trade-off] Premature islands grouping** → `islands/about/` has only 2 files. Minor cost now, avoids larger migration later.

## Open Questions

None — all decisions were made during the exploration phase with the user.
