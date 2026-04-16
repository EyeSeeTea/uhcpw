## Context

The Astro /about and /methods pages have CSS differences from the React SPA. The root causes are:

1. **About — office image size**: The Astro `<img>` sets explicit `width` and `height` HTML attributes from data, but lacks `height: auto` to maintain aspect ratio at `width: 100%`. The SPA only sets `width="100%"` with no height attribute.

2. **About — `.text-column` spacing**: The SPA uses MUI `Grid spacing={5}` which applies 20px padding to each grid item (totaling 40px between items) plus MUI `Container maxWidth="sm"` (600px) with its own 24px horizontal padding. The Astro version uses CSS grid `gap: 40px` which is close but missing the inner item padding that MUI provides. The text column also lacks the equivalent of MUI Container's horizontal padding.

3. **Methods — `.title-banner` height**: The SPA renders the title with MUI `Typography variant="h3"` which has `line-height: 1.167`. The Astro version uses an `h1` element with `font-size: 3rem` but no explicit `line-height`, inheriting a taller line-height that adds extra vertical space.

## Goals / Non-Goals

**Goals:**
- Achieve pixel-perfect visual parity with the SPA on desktop and mobile for /about and /methods
- Fix only the specific CSS properties causing the discrepancies

**Non-Goals:**
- Refactoring the overall page structure or component architecture
- Addressing any other visual differences beyond the three identified issues

## Decisions

1. **Office image**: Remove the explicit `height` HTML attribute and add `height: auto` CSS to ensure the image scales naturally at `width: 100%`, matching the SPA behavior.

2. **Text column spacing**: Add padding to grid items to replicate MUI Grid's item padding behavior. Adjust the text column's inner container to account for MUI Container's padding.

3. **Title banner line-height**: Add `line-height: 1.167` to `.title-banner h1` to match MUI's `h3` variant typography.

## Risks / Trade-offs

- These are purely CSS changes scoped to two pages with no functional impact.
- The MUI Grid spacing model is complex (negative margins + item padding); we replicate only the visual outcome, not the mechanism.
