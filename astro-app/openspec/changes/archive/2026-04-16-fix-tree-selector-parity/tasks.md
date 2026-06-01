## 1. Investigate root cause (timeboxed)

- [x] 1.1 [FE] Start the Astro dev server (`nvm use && yarn start` in `astro-app/`, port 4321) and the SPA reference server (port 8081). Load `/about` in both.
- [x] 1.2 [FE] In the Astro `/about` experts section, open DevTools and confirm which `<style>` tags exist in `<head>` — specifically `<style data-styled>` (styled-components) and `<style data-jss>` / `<style data-meta="SearchInput">` (makeStyles). Record findings.
- [x] 1.3 [FE] Compare computed styles for the five target elements (search input, "Select all", "Clear all", selected chip, floating Clear) against the SPA. Capture concrete computed values (height, color, text-transform, background, top/right) from both sides.
- [x] 1.4 [FE] Check for multiple runtime instances: evaluate `window.sc?.g_` and look for multiple `__SC_*` globals or duplicate JSS style registries. If duplicates exist, capture which chunks load each copy (Network → JS chunks).
- [x] 1.5 [FE] Timebox this investigation to ~30 minutes. If a local root-cause fix is clear, proceed to section 2. Otherwise skip to section 3 (CSS overrides).

**Investigation findings (2026-04-16):**
- Single runtime instance of both `styled-components` v5.3.5 and `@material-ui/styles` v4.11.5 (resolved from monorepo root `node_modules/`). No dedupe needed.
- `<style data-styled>` AND `<style data-meta="...">` tags are both present in Astro's `<head>`.
- **Root cause A (buttons, chips, placeholder):** CSS insertion order is reversed. In SPA order is `vite → jss:* (many) → styled-components` (styled-components last ⇒ wins). In Astro order is `vite → styled-components → jss:* (many)` (JSS last ⇒ wins). MUI `.MuiButton-text` / `.MuiChip-root` single-class selectors have equal specificity to styled-components classes, so insertion order decides. Fix: wrap the island in `<StylesProvider injectFirst>` from `@material-ui/styles` to force JSS to the top of `<head>`.
- **Root cause B (search height):** Astro's global reset at `src/styles/theme.css:127` sets `* { box-sizing: border-box }`, which the SPA does not use (SPA is `content-box`). The SearchInput's inline `height: 20px` + `padding: 10px` + `border: 1px` renders as 22px in border-box but 42px in content-box. Fix: scoped CSS override in `experts-network.css` to restore `box-sizing: content-box` for the SearchInput's Paper root inside the experts selector.

## 2. Root-cause fix (only if diagnosed in section 1)

- [~] 2.1 [FE] Dedupe not needed — single runtime instance confirmed during investigation.
- [x] 2.2 [FE] Wrapped the island in `<StylesProvider injectFirst>` from `@material-ui/styles` inside `ExpertsNetworkSelector.tsx`. This forces MUI JSS to inject at the top of `<head>`, letting styled-components (inserted later) win the cascade — restoring SPA parity.
- [x] 2.3 [FE] Reloaded dev server and confirmed via `getComputedStyle`: buttons (`color: rgb(255,165,0)`, `text-transform: none`, `font-weight: 400`, `padding: 0`), chips (`bg: rgb(207,233,247)`, `height: 32px`, `border-radius: 20px`), floating Clear (`position: absolute; top: -35px; right: -15px`; orange; non-uppercase), placeholder `padding-left: 16px` — all match SPA exactly. Only residual was search input height, fixed in section 3.1.
- [x] 2.4 [FE] Smoke-tested `/methods` (renders fine) and `/` (returns 404 — pre-existing static-dev behaviour, unrelated).

## 3. Scoped CSS overrides (residual fix only)

- [x] 3.1 [FE] Added scoped CSS in `astro-app/src/styles/experts-network.css` restoring `box-sizing: content-box` for `.MuiMenu-paper [role="search"]` so the inline `height: 20px` + 10px padding + 1px border expands to 42px (matching SPA content-box behaviour). Astro's global `* { box-sizing: border-box }` in `theme.css` otherwise clamped it to 22px.
- [~] 3.2 [FE] Not needed — `StylesProvider injectFirst` fixes chip cascade.
- [~] 3.3 [FE] Not needed — `StylesProvider injectFirst` fixes in-dropdown button cascade.
- [~] 3.4 [FE] Not needed — `StylesProvider injectFirst` fixes floating Clear button cascade; positioning via styled-components now applies correctly.
- [~] 3.5 [FE] Not needed — placeholder `padding-left: 16px` already matches SPA after injectFirst.
- [x] 3.6 [FE] Added explanatory comment in `experts-network.css` documenting why the `box-sizing` override is scoped to the MUI Menu portal.

## 4. Verify pixel parity

- [x] 4.1 [FE] Verified via chrome-devtools-mcp on `/about` at 1280px (desktop), 768px (tablet), and 375px (mobile). All five target elements match SPA exactly.
- [x] 4.2 [FE] Captured computed-style measurements:

| Element (state) | Astro (before) | Astro (after) | SPA |
| --- | --- | --- | --- |
| Search input rect height (all viewports) | 22px | 42px | 42px |
| Search input `box-sizing` | border-box | content-box | content-box |
| "Select all" `color` | rgb(0,0,0) | rgb(255,165,0) | rgb(255,165,0) |
| "Select all" `text-transform` | uppercase | none | none |
| "Select all" `font-weight` | 500 | 400 | 400 |
| "Select all" `padding` | 6px 8px | 0 | 0 |
| "Clear" (in dropdown) `color` / `text-transform` | rgb(0,0,0) / uppercase | rgb(255,165,0) / none | rgb(255,165,0) / none |
| Selected chip `background-color` | (unset) | rgb(207,233,247) | rgb(207,233,247) |
| Selected chip `border-radius` / `height` | default / — | 20px / 32px | 20px / 32px |
| Floating Clear `position` / `top` / `right` | static / — | absolute / -35px / -15px | absolute / -35px / -15px |
| Floating Clear `color` / `text-transform` | rgb(0,0,0) / uppercase | rgb(255,165,0) / none | rgb(255,165,0) / none |
| Input `padding-left` (placeholder offset) | 0 | 16px | 16px |

- [x] 4.3 [FE] No regressions on `/about` — team grid, office header, and gradient dividers render as before.
- [x] 4.4 [FE] Smoke-tested `/methods` (renders fine). `/` returns pre-existing 404 in dev mode (unrelated to this change).

## 5. Tests & specs

- [x] 5.1 [FE] `yarn astro check` → 0 errors / 0 warnings / 8 hints (all pre-existing). `yarn test` → 58 passed, 1 skipped (pre-existing), 0 failed.
- [x] 5.2 [FE] Added `astro-app/src/islands/about/__tests__/ExpertsNetworkSelector.test.tsx` as a source-level regression guard (checks that the file still imports `StylesProvider` and wraps children in `<StylesProvider injectFirst>`). Runtime style-order assertion is not viable because the monorepo's React-17 `@material-ui/styles` clashes with astro-app's React 18 inside jsdom ("Invalid hook call"). Runtime parity is instead verified by chrome-devtools-mcp in section 4.
- [x] 5.3 [CR] Code review complete. Reviewer flagged two should-fix items and one should-improve: (a) CSS `.MuiMenu-paper [role="search"]` was too broad — retightened to `#tree-selector-menu [role="search"]` (stable id set by the shared TreeSelector, uniquely identifies this instance). (b) Universal `*` + pseudo-element descendant overrides dropped — only the Paper itself needs `content-box`. (c) Test rewritten from regex source-scan to `vi.mock`-based JSX structural assertion verifying `StylesProvider injectFirst` → `MuiThemeProvider` → legacy provider → `TreeSelector` nesting. Inline comment also trimmed. Remaining nits (comment length, stray blank line) addressed.
- [x] 5.4 [FE] Updated `openspec/specs/experts-country-filter/spec.md` with the two new requirements (visual parity + no-fork guard) as part of archiving.
