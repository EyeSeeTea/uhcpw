## Why

The React SPA recently replaced the mobile footer "About us" accordion with a styled link that navigates straight to the `/about` page (PR #714, commit `86688f74`, merged as `7d3460bf`). The Astro static site still renders an "About us" `<details>`/`<summary>` accordion on mobile, so its footer now visually and functionally diverges from the SPA on mobile viewports. Visual parity with the SPA is the whole point of this static-site PoC, so the Astro footer needs to match.

## What Changes

- Remove the "About us" accordion item from the mobile footer in `src/components/layout/Footer.astro`.
- Add a pill-styled `<a href="/about">About us</a>` rendered in the same mobile grid slot (between the logos row and the remaining accordions).
- Match SPA visual metrics on mobile: accordion summaries and the About-us pill render at 56px min-height; inter-item spacing collapses to a single 8px gap (previously ~24px from stacked margins + row-gap).
- Animate open/close of the remaining `<details>` accordions (glossary, privacy, contact) so they transition instead of snapping.
- Left-align the copyright bar on mobile to match the SPA (no more center alignment below 960px).
- Remove the inner `.footer-grid` horizontal padding that was doubling with `.footer-top`'s 32px and making the mobile footer feel narrower than the SPA.
- Keep desktop/tablet markup and behavior unchanged (the desktop "About us" link already points to `/about`).
- Update the `footer-chrome` spec's mobile requirement so "About us" is no longer described as an accordion section.

## Capabilities

### New Capabilities
<!-- none -->

### Modified Capabilities
- `footer-chrome`: The mobile footer no longer wraps "About us" in an accordion; it is a direct link styled to match the accordion summary rows.

## Impact

- Affected code: `astro-app/src/components/layout/Footer.astro` (markup + scoped CSS for mobile grid areas).
- No new dependencies, no data-layer changes, no API changes.
- No build or routing changes; `/about` already exists.
- Rollback: revert the single commit touching `Footer.astro` and the spec delta.
