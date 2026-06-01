## Why

The astro-app has accumulated technical debt during rapid PoC development: duplicated utilities (URL normalization in 3 places, auth headers in 2, avatar constant in 3), dead code, type safety bypasses, accessibility violations, and styling anti-patterns (global CSS injection, unnecessary `is:global`). These issues increase maintenance cost, risk subtle bugs from inconsistent behavior, and hurt performance/accessibility scores.

## Goals

- Eliminate code duplication by extracting shared utilities
- Remove dead code and pointless tests
- Fix type safety issues in the composition root
- Improve accessibility (proper aria-labels, valid HTML attributes, image dimensions)
- Fix styling issues (FOUC from client-injected CSS, unscoped global styles)
- Centralize data shaping so all consumers get consistent values

## Non-goals

- Adding new features or pages
- Refactoring the shared SPA code in `../src`
- Changing the build/deploy pipeline
- Redesigning component architecture

## What Changes

- **Delete** `src/data/about/image-validation.ts` (dead code, never imported)
- **Delete** `src/lib/__tests__/shared-imports.test.ts` (tests only type instantiation, no runtime value)
- **Extract** `normalizeUrl` into `src/lib/url.ts`, replace 3 duplicate implementations
- **Extract** `AVATAR_FALLBACK` into `src/data/about/constants.ts`, replace 3 duplicate definitions
- **Extract** navigation items into `src/data/navigation.ts`, used by both DesktopNav and MobileNav
- **Fix** `null as unknown` cast in `composition-root.server.ts` with a proper typed approach
- **Move** ExpertsNetwork inline CSS string to a dedicated `.css` file imported at Astro page level
- **Replace** hardcoded font-family in ExpertsNetwork with CSS variable `var(--font-family-base)`
- **Remove** `is:global` from DesktopNav.astro, scope styles properly
- **Centralize** abbreviations/glossary URL resolution (with fallbacks) in the data layer
- **Fix** `width="100%"` HTML attribute on img in OfficeHeader → use CSS
- **Replace** inline `onerror` handler in PersonCard with build-time fallback or scoped script
- **Add** `width`/`height` attributes to lazy-loaded person card images
- **Fix** `aria-label` values from kebab-case IDs to human-readable text

## Capabilities

### New Capabilities

- `shared-utilities`: Shared URL normalization and constants extracted to `lib/` and `data/`

### Modified Capabilities

- `person-card`: Fix accessibility (aria-labels, image dimensions, inline onerror removal)
- `header-chrome`: Scoped styles in DesktopNav, shared nav data between Desktop/MobileNav
- `about-page-rendering`: ExpertsNetwork CSS extracted to file, avatar constant centralized
- `methods-page-rendering`: URL resolution centralized in data layer instead of page-level
- `react-integration`: ExpertsNetwork CSS no longer injected via JS string

## Impact

- **Files modified**: ~15 files across components, pages, islands, data, lib, infra
- **Files deleted**: 2 (dead code + pointless test)
- **Files created**: ~3 (shared utilities, CSS file, nav data)
- **No breaking changes**: All changes are internal refactoring
- **No dependency changes**: No new packages needed

## User Impact

- Improved accessibility scores (valid HTML, proper aria-labels, image dimensions)
- Eliminated FOUC on ExpertsNetwork section
- No visible UI changes

## Compatibility

All changes are backward-compatible internal refactoring. No public API or URL changes.

## Rollback Plan

Standard git revert — all changes are isolated to the astro-app with no external dependencies.
