## 1. Update CSS breakpoints

- [x] 1.1 In `astro-app/src/components/layout/MobileNav.astro`, change the `@media (max-width: 960px)` rule that toggles `.mobile-nav-wrapper { display: block }` to `@media (max-width: 1279px)`.
- [x] 1.2 In `astro-app/src/components/layout/DesktopNav.astro`, change the `@media (min-width: 961px)` rule that toggles `.desktop-nav { display: flex }` to `@media (min-width: 1280px)`.

## 2. Verify coupling in Header.astro

- [x] 2.1 Inspect Header.astro at 1000px / 1100px / 1200px / 1279px vs SPA — confirm whether the top-bar gradient, top-links visibility, and logo-group padding are visibly coupled to the nav switch. If yes, open a follow-up change (out of scope here).
- [x] 2.2 Grep the Astro codebase for other references to `960` / `961` / `small-screen breakpoint` that may assume the nav boundary; none should exist in nav logic after this change.

## 3. Visual parity verification

- [x] 3.1 Run `yarn start` and the SPA (per Dev ports memory), compare Header at viewports 1440, 1280, 1279, 1100, 961, 960, 768 using the `visual-compare` skill. Verify hamburger/desktop-nav swap at 1280 ↔ 1279 in both apps.
- [x] 3.2 Confirm no horizontal overflow or clipping in the 961–1279px band.

## 4. Validation

- [x] 4.1 `yarn astro check` passes. (3 pre-existing errors in `src/islands/home/HomeMapDesktop.tsx` unrelated to this change; no new errors in `MobileNav.astro` / `DesktopNav.astro`.)
- [x] 4.2 `yarn build` succeeds.
- [x] 4.3 `openspec validate match-header-menu-breakpoint --strict` passes.
