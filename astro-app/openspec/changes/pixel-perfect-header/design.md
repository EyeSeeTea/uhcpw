## Context

The Astro header was built to match the SPA but has two categories of discrepancy:

1. **Desktop spacing**: Nav item margins use `16px 8px` while the SPA uses `16px 16px`. The top toolbar uses symmetric `64px` horizontal padding while the SPA uses `64px` left / `60px` right.
2. **Mobile "Countries & areas"**: Astro renders an inline `<details>` accordion. The SPA renders a floating popup menu (MUI `Menu` component via `MobileMenuSubItem`) that appears as a separate scrollable overlay anchored to the button.

All changes are purely presentational — CSS value fixes and a mobile submenu rendering change. No data flow, API, or architecture changes are involved.

## Goals / Non-Goals

**Goals:**
- Pixel-perfect desktop header spacing parity with the SPA.
- Match the SPA's mobile "Countries & areas" UX: a floating popup menu instead of an inline accordion.

**Non-Goals:**
- Changing "Regional overview" mobile behavior (already correct — uses a modal dialog).
- Refactoring header component structure or introducing new abstractions.
- Adding MUI or any new dependencies.

## Decisions

### Decision 1: Fix desktop nav margins directly in CSS

Change `.nav-link` margin from `16px 8px` to `16px 16px` in `DesktopNav.astro`.

**Rationale**: Direct one-line CSS fix. The SPA's `MenuButton` and `useStyles().menu` both use `margin: "16px 16px"`. No alternative needed — this is a straightforward value correction.

### Decision 2: Fix top toolbar asymmetric padding

Change `.toolbar-top` padding from `12px 64px` to `padding: 12px 64px` with explicit `padding-right: 60px` in `Header.astro`.

**Rationale**: The SPA uses `paddingLeft: theme.spacing(8)` (64px) and `paddingRight: theme.spacing(7.5)` (60px). The Astro shorthand `padding: 12px 64px` applies 64px to both sides.

### Decision 3: Replace `<details>` accordion with a floating popup for "Countries & areas" on mobile

Replace the `<details class="menu-submenu">` for "Countries & areas" with a `<button>` that toggles a positioned popup `<div>`. The popup will be:
- Absolutely positioned relative to the button
- Styled with the same blue background as the mobile menu
- Scrollable with `max-height: 558px; overflow-y: auto`
- Closed on outside click or item selection

**Rationale**: The SPA uses `MobileMenuSubItem` which renders a MUI `Menu` — a floating popup anchored to the trigger. The current `<details>` accordion is a fundamentally different pattern that expands the menu inline. A vanilla JS popup matches the SPA behavior without requiring MUI.

**Alternative considered**: Using a React island for this component. Rejected — the rest of the mobile nav is pure Astro/HTML, and a small vanilla JS popup keeps things consistent and avoids hydration overhead.

## Risks / Trade-offs

- [Popup positioning edge case on very small screens] → Mitigation: Use the same positioning approach as the SPA's rotated-screen fallback (`position: absolute; top: 100%`) which is already proven to work.
- [Accessibility of custom popup vs native `<details>`] → Mitigation: Add proper `aria-expanded`, `aria-haspopup`, and keyboard support (Escape to close) to the custom popup. The `<details>` element provided built-in disclosure semantics, so we need to replicate those manually.
