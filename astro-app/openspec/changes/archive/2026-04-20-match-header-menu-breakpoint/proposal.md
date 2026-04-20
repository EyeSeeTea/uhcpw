## Why

The Astro header switches from the desktop nav to the hamburger mobile menu at `960px`, but the React SPA keeps the hamburger menu visible up to MUI's `lg` breakpoint (`1280px`, via `<Hidden lgUp>` / `<Hidden mdDown>` in `AppHeader.tsx`). As a result, viewports in the 961–1279px range render the desktop nav in Astro but the mobile hamburger in the SPA, breaking visual parity on tablets and narrower laptops.

## What Changes

- Raise the header's mobile/desktop nav breakpoint in Astro from `960px` to `1280px` so the hamburger menu is shown below `1280px` and the desktop nav at `1280px` and above, matching the SPA.
- Update `MobileNav.astro` show-rule (`max-width: 960px` → `max-width: 1279px`).
- Update `DesktopNav.astro` show-rule (`min-width: 961px` → `min-width: 1280px`).
- Do **not** change unrelated `960px` rules elsewhere in `Header.astro` (toolbar-top gradient/top-links, logo-group padding, home-page UHC logo hide) unless they are visibly coupled to the nav switch — those are tracked as a verification step, not a scope change.

## Capabilities

### New Capabilities
_(none)_

### Modified Capabilities
- `header-chrome`: the viewport threshold at which the header swaps between the desktop nav and the hamburger mobile nav changes from `960px` to `1280px`.

## Impact

- Affected files: `astro-app/src/components/layout/MobileNav.astro`, `astro-app/src/components/layout/DesktopNav.astro` (and possibly couplings in `Header.astro`).
- Visual: at viewport widths `961–1279px` Astro will now show the hamburger menu instead of the inline desktop nav. This is the target behavior (SPA parity), not a regression.
- No data, routing, or API changes. No new dependencies.
