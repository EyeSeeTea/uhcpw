## Context

The React SPA's `AppHeader.tsx` uses MUI's `Hidden` utility to swap navigation surfaces:

```tsx
<Hidden lgUp>  <MobileMenu /> </Hidden>
<Hidden mdDown><DesktopMenu/></Hidden>
```

With MUI's default theme, `lg` is `1280px`, so the hamburger is shown at viewport widths `< 1280px` and the desktop nav at `>= 1280px`.

The Astro port re-implements the swap with CSS media queries using `960px`:

- `MobileNav.astro` → `@media (max-width: 960px) { .mobile-nav-wrapper { display: block } }`
- `DesktopNav.astro` → `@media (min-width: 961px) { .desktop-nav { display: flex } }`

This produces a parity gap in the `961–1279px` range.

## Goals / Non-Goals

**Goals:**
- Match the SPA's nav breakpoint exactly: hamburger below `1280px`, desktop nav at `1280px` and above.
- Keep the change small and surgical — two CSS media queries in two files.

**Non-Goals:**
- Touching the rest of the `960px` rules in `Header.astro` (toolbar-top gradient swap, top-links hide, logo-group padding, home-page UHC logo hide) unless verification shows they are visibly coupled to the nav switch. These breakpoints exist in the SPA too and use different thresholds (e.g., `BREAKPOINT_WIDTH_SMALL_SCREEN`, `400px`, `402px`, `600px`); changing them is out of scope for this proposal.
- Introducing a shared SCSS variable / design token for breakpoints. The codebase does not use one today; adding it would be an unrelated refactor.

## Decisions

**Decision 1: Use `1279px` / `1280px` literal values, not a shared variable.**
Rationale: consistent with how the rest of the Astro header hard-codes breakpoints (`960`, `961`, `600`, `500`, `420`, `400`). Introducing a token here would be a partial refactor. If we later want a token, it can be done repo-wide in a follow-up.
Alternatives: (a) add `--breakpoint-lg: 1280px` CSS var — rejected, media queries can't use CSS custom properties portably. (b) SCSS map — out of scope.

**Decision 2: Keep the mobile rule as `max-width: 1279px` and the desktop rule as `min-width: 1280px`.**
Rationale: mirrors MUI's `Hidden lgUp` semantics — `lgUp` hides from `lg` (`1280px`) upward, i.e. shown at `<= 1279px`. This avoids the `==1280px` overlap that would appear if both rules used `1280px`.
Alternatives: `max-width: 1280px` / `min-width: 1281px` — off by one vs SPA; rejected.

**Decision 3: Leave unrelated `960px` rules in `Header.astro` alone.**
Rationale: those rules govern toolbar-top styling, logo padding, and the home-page UHC logo hide. They are not the nav switch. Conflating them bloats the change and risks regressions on independently-tuned mobile styling.

## Risks / Trade-offs

- **[Risk]** At `961–1279px`, the hamburger menu is now shown, but surrounding header rules (`@media (max-width: 960px)` gradient/top-links/logo padding) still switch at `960px`. The intermediate band may show "desktop top bar + mobile hamburger" briefly, which is exactly what the SPA does (the SPA's top-bar styling in that range also differs from its `<600px` rules). → Mitigation: verify visually against SPA at 1000px, 1100px, 1279px, 1280px; only widen the scope if parity actually fails.
- **[Risk]** Downstream components or tests may assume the `960px` threshold for the nav. → Mitigation: grep for `960` / `961` in code and tests, update only nav-related usages.

## Migration Plan

1. Edit `MobileNav.astro` and `DesktopNav.astro` media queries.
2. Update `openspec/specs/header-chrome/spec.md` breakpoint references (via the change's spec delta on archive).
3. Visual verification with the `visual-compare` skill at desktop (1440), laptop (1280), in-between (1100), and mobile (768) viewports against the SPA.
4. Rollback: revert the two CSS edits.

## Open Questions

- Should `Header.astro`'s `960px` rules for top-bar gradient and top-links hide be migrated to `1280px` for tighter SPA parity? Decision deferred until visual verification; if the SPA hides its top-bar links at `lg` too, include them in this change. Otherwise, leave out of scope.
