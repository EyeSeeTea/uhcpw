## Why

The `src/lib/` directory has become a "junk drawer" mixing three distinct concerns: page-specific data logic (about-data, about-images, image-validation), framework glue (composition root, Future adapters), and generic utilities (markdown, image-downloader). Tests follow two incompatible conventions (colocated siblings vs `__tests__/` subfolder). The `islands/` directory is flat with no feature grouping. Dead code (`futures.ts`) and a dev-only debug page (`test-data.astro`) are shipping in the build. Addressing this now — while the project is small (3 pages, 2 islands, 9 lib files) — prevents the structure from calcifying as more pages are added.

## Goals

- Clear separation of concerns: data-fetching logic, infrastructure glue, and generic utilities each have a home
- Consistent test location convention (`__tests__/` subfolders) matching the parent React SPA project
- Feature-based grouping for islands (matching the pattern `components/` already uses)
- Remove dead code and dev-only artifacts
- Document the conventions in AGENTS.md so future work follows them

## Non-goals

- Changing any runtime behavior — this is a pure restructuring
- Refactoring the code itself (no API changes, no logic changes)
- Touching `components/` — already well-organized by feature

## What Changes

- **New `src/data/` directory**: page-specific data-fetching and shaping logic, grouped by feature (e.g., `data/about/`)
- **New `src/infra/` directory**: framework glue — composition root, Future-to-Promise bridge
- **Slimmed `src/lib/`**: only truly generic, reusable utilities remain (markdown, image-downloader)
- **Reorganized `src/islands/`**: grouped by feature (`islands/about/`)
- **Unified test convention**: all tests move to `__tests__/` subfolders within their parent directory
- **Delete `src/lib/futures.ts`**: `apiToFuture` is unused (confirmed via grep)
- **Delete `src/pages/test-data.astro`**: dev/debug page that shouldn't ship
- **Updated AGENTS.md**: folder structure guidelines for future contributors

## Capabilities

### New Capabilities
- `folder-conventions`: Guidelines and AGENTS.md rules for where new files should be placed (data/, infra/, lib/, islands/, components/)

### Modified Capabilities
- `about-data-fetching`: files move from `lib/` to `data/about/` — import paths change
- `shared-code-imports`: smoke test moves to `lib/__tests__/` — path changes
- `react-integration`: island files move to `islands/about/` — import paths change
- `shared-deps`: `futures.ts` deleted (unused), `future-bridge.ts` moves to `infra/`

## Compatibility

All changes are internal path reorganization. No public API, no external interface changes. The build output is identical (minus removal of test-data page).

## Rollback plan

Revert the single commit (or PR). No data migration, no config changes.

## Impact

- **Pages**: `about.astro` and `methods.astro` import paths update (lib/ -> data/about/, infra/)
- **Islands**: ExpertsNetwork and PersonCardReact move to `islands/about/`
- **Tests**: all 6 test files relocate to `__tests__/` subfolders
- **Build**: no change to output (aside from removed test-data page)
- **Dependencies**: none added or removed
