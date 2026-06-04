## Context

`Footer.astro` renders a single responsive footer with a desktop grid (logo / flag / links / contact) and a mobile variant (logos row + `<details>` accordions for About us, Abbreviations & glossary, Privacy policy, Contact). On viewports ≤ 960px the desktop columns are hidden and the four mobile accordions become the visible content.

The SPA's `MobileAppFooter.tsx` (commit `86688f74`) removed the About-us accordion item and rendered a pill-styled `NavLink` to `/about` just above the remaining accordions. Visually it matches the accordion summaries (same background, border-radius, height, font weight/size) but without the expand chevron.

The Astro footer already has a desktop "About us" link to `/about`; the mobile accordion was carried over from the earlier SPA layout and is now stale.

## Goals / Non-Goals

**Goals:**
- Match the SPA's mobile footer: About-us becomes a direct link, not an accordion.
- Preserve the existing desktop/tablet layout and behavior.
- Keep the mobile grid order: logos row → About-us link → other accordions.
- Reuse the footer's existing CSS tokens (`--color-accent-primary`, `--color-white`, etc.) so the link shares the accordion look.

**Non-Goals:**
- Extracting the mobile footer into a separate component.
- Changing desktop-side About-us markup or styling.
- Adding client-side JS (the link is plain anchor markup).
- Changing the other mobile accordions (glossary, policy, contact).

## Decisions

### Replace accordion with styled anchor, not a disabled accordion

The SPA renders an `<a>` element styled as a pill. Mirror that in Astro with `<a href="/about" class="mobile-about-link">About us</a>` guarded by `mobile-only` so it only appears at ≤960px. Alternative considered: keep `<details>` and auto-navigate via JS — rejected because it adds JS, degrades without JS, and doesn't match SPA DOM.

### Place the link in the mobile grid via a new `grid-area`

Extend the mobile `grid-template-areas` to include an `about-link` row between `logo/flag` and `acc-about…`. Rename/remove `acc-about` (since the About accordion is gone). The new row keeps layout predictable and matches the SPA's stacking order. Alternative considered: position with `order`/flex — rejected because the rest of the mobile footer already uses grid areas; consistency wins.

### Style via scoped CSS only

Add the pill styling to `Footer.astro`'s scoped `<style>` block. No new CSS modules, no new assets. Values mirrored from the SPA: `min-height: 48px`, `padding: 0 16px`, `margin: 8px 0`, `background: var(--color-accent-primary)`, `border: 1px solid rgba(255,255,255,0.2)`, `border-radius: 20px`, text `font-size: 20px` / `font-weight: 500`.

### Data flow through the architecture layers

No data-layer changes. This is a UI-only change in the presentation layer (`src/components/layout/Footer.astro`). `GeneralContent` props flow remains unchanged — the About-us link's target is a static route (`/about`) just like the existing desktop link, so no infrastructure/application touchpoints.

## Risks / Trade-offs

- [Risk] The new link shifts mobile grid areas; if any page relies on the current `acc-about` grid area (it doesn't, but worth asserting), layout could break. → Mitigation: keep visual verification via `/visual-compare` at 360/768px before merging.
- [Risk] Scoped CSS could drift from SPA `styled-components` values over time. → Mitigation: comment the 20px/500/48px values as "matches SPA MobileAppFooter AboutUsLink" so future readers know they're intentional duplicates. *(Per repo style rules comments should only flag non-obvious invariants — this link's values being SPA-sourced qualifies.)*
- [Trade-off] Dropping the accordion removes the "expand" affordance for additional About content. Acceptable: the /about page is where that content now lives, matching the SPA.

## Migration Plan

1. Edit `Footer.astro` markup and CSS.
2. Verify with `/visual-compare` at mobile (≤500px), tablet (768px), desktop (≥1200px).
3. No data migration, no feature flag.
4. Rollback: `git revert` the single commit.

## Open Questions

None.
