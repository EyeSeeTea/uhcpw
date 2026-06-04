## Why

The current 404 page in the Astro app is a bare placeholder (`<h1>UHC Watch - Page not found - 404</h1>`) with no styling or user guidance. The React SPA has a fully designed 404 page with a styled header banner, large "404" display, descriptive text, and a "Go to Homepage" button. Replicating this ensures visual parity and a proper user experience when visitors hit missing routes.

## What Changes

- Replace the placeholder content in `src/pages/404.astro` with a fully styled 404 page matching the SPA design
- Add a title banner section with orange background and bubble pattern overlay (reuses existing `bubble-pattern-white.png` asset)
- Add a content section with large "404" heading, descriptive message, and homepage link button
- Responsive design with mobile breakpoint at 600px

## Goals

- Visual parity with the React SPA's NotFoundPage
- Consistent use of the existing Layout, Header, and Footer chrome

## Non-goals

- Adding client-side JavaScript or React islands (this is a purely static page)
- Changing routing behavior or adding catch-all dynamic routes
- Modifying the shared Layout component

## Capabilities

### New Capabilities

- `not-found-page`: Static 404 page with styled header banner, error message, and homepage navigation button

### Modified Capabilities

## Impact

- **Files changed**: `src/pages/404.astro` (existing file, content replacement)
- **Assets**: Reuses `bubble-pattern-white.png` already available in the SPA's assets
- **Dependencies**: None new — uses existing Layout, design tokens, and shared styles
- **Compatibility**: No breaking changes; replaces a placeholder with a complete implementation
- **Rollback**: Revert the single file change to restore the placeholder

## User Impact

Visitors who navigate to a non-existent URL will see a professional, branded 404 page with clear guidance to return to the homepage, instead of a raw text placeholder.
