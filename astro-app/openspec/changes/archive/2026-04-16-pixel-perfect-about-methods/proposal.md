## Why

The Astro /about and /methods pages have visual discrepancies compared to the React SPA that break pixel-perfect parity. Specifically: the office image on /about doesn't match the SPA sizing, the `.text-column` spacing/positioning differs, and the `.title-banner` on /methods has more height than the SPA version. These need to be corrected to meet the PoC's goal of faithful visual reproduction.

## What Changes

- Fix office image dimensions on /about to match SPA sizing
- Correct `.text-column` spacing and positioning relative to adjacent text in the OfficeHeader component
- Reduce `.title-banner` height on /methods to match SPA

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `about-page-rendering`: Fix office image size and `.text-column` layout spacing to match SPA
- `methods-page-rendering`: Reduce `.title-banner` height/padding to match SPA

## Impact

- `src/components/about/OfficeHeader.astro` — image sizing and grid/spacing CSS
- `src/pages/methods.astro` — `.title-banner` padding/height CSS
- No API, dependency, or breaking changes
