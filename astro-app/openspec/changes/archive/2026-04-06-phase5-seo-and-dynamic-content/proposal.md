## Why

The Astro POC has functional About and Methods pages but lacks SEO meta tags and uses hardcoded content in the Header/Footer instead of fetching it from DHIS2 like the React SPA does. Without SEO tags, pages have no Open Graph/Twitter Card support and poor search engine visibility. Without dynamic header/footer content, the Astro site diverges from the SPA's data-driven behavior — abbreviation/glossary links, footer disclaimer, and cookie policy URL should all come from DHIS2 via `GeneralContent`.

## What Changes

- **Add SEO meta tags to all pages**: Reuse the existing `SeoConfig` domain entity (`src/domain/entities/SeoConfig.ts`) to generate `<title>`, `<meta description>`, Open Graph, Twitter Card, and canonical link tags. Cover all routes defined in `seoRouteConfigs` — including pages that don't exist yet in Astro (they'll be ready when those pages are added).
- **Create an Astro SEO component**: Build a reusable `SeoHead.astro` component (or integrate `@codiume/astro-seo-meta` if it fits) that renders all meta tags in the `<head>`.
- **Make Header dynamic**: Fetch `GeneralContent` at build time and pass abbreviations/glossary URLs to the Header so links point to real DHIS2 file URLs instead of hardcoded `#` placeholders.
- **Make Footer dynamic**: Fetch `GeneralContent` at build time and pass the footer disclaimer text and cookie policy URL to the Footer so content matches the SPA.
- **Fetch `GeneralContent` in the layout**: Add a build-time data fetch in the Layout (or pages) so `GeneralContent` is available to Header and Footer without duplicating the fetch.

## Non-goals

- Responsive design testing (already done in previous phases).
- Performance audit / bundle size analysis (separate follow-up).
- Adding new pages beyond what already exists.
- i18n / localization support.

## Capabilities

### New Capabilities

- `seo-meta-tags`: SEO meta tag generation for all pages using the shared `SeoConfig` entity — covers title, description, OG, Twitter Card, and canonical URL.

### Modified Capabilities

- `header-chrome`: Header links (Abbreviations, Glossary) become dynamic, sourced from `GeneralContent` fetched at build time.
- `footer-chrome`: Footer disclaimer text and privacy policy URL become dynamic, sourced from `GeneralContent` fetched at build time.

## Impact

- **Layout.astro**: Will accept and render SEO props; will fetch or receive `GeneralContent`.
- **Header.astro**: Props change to accept dynamic link URLs.
- **Footer.astro**: Props change to accept dynamic disclaimer and policy URL.
- **All page files** (`about.astro`, `methods.astro`, `404.astro`): Will pass SEO config to the layout.
- **Dependencies**: Possibly `@codiume/astro-seo-meta` (optional — can be done with a plain Astro component).
- **Shared code**: Reuses `SeoConfig.ts` and `GeneralContent` entity + repository from `../src/`.

## Compatibility

No breaking changes. All modifications are additive (new props, new head content). Existing page rendering is unaffected.

## Rollback plan

Revert the commits. Since all changes are build-time static HTML additions (meta tags, dynamic text), there are no runtime dependencies to unwind.
