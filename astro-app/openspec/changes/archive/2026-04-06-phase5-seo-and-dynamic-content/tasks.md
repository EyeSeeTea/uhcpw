## 1. SEO Meta Tags

- [x] 1.1 Create `SeoHead.astro` component in `src/components/seo/` that accepts a `SeoConfig` prop and renders title, description, OG, Twitter Card, and canonical link tags in the `<head>`
- [x] 1.2 Update `Layout.astro` Props interface to accept `seo?: SeoConfig` and `generalContent` props; render `SeoHead` in the `<head>` slot; pass `generalContent` slices to Header and Footer
- [x] 1.3 Update `about.astro` to compute `SeoConfig` via `getSeoConfigForRoute()` and fetch `GeneralContent`, passing both to Layout
- [x] 1.4 Update `methods.astro` to compute `SeoConfig` via `getSeoConfigForRoute()` and fetch `GeneralContent`, passing both to Layout
- [x] 1.5 Update `404.astro` to pass default `SeoConfig` and fetch `GeneralContent`, passing both to Layout
- [x] 1.6 Configure `Astro.site` in `astro.config.mjs` (via env var or hardcoded for POC) so canonical URLs can be generated

## 2. Dynamic Header Content

- [x] 2.1 Update `Header.astro` to accept `abbreviationsUrl` and `glossaryUrl` props
- [x] 2.2 Replace hardcoded `#` links with dynamic prop values; conditionally render links only when URL is available
- [x] 2.3 Update any sub-components (e.g., `TopBar.astro` or inline top bar markup) to use the new props

## 3. Dynamic Footer Content

- [x] 3.1 Update `Footer.astro` to accept `disclaimer`, `privacyPolicyUrl`, `abbreviationsUrl`, and `glossaryUrl` props
- [x] 3.2 Replace hardcoded disclaimer text with the `disclaimer` prop value
- [x] 3.3 Replace hardcoded privacy policy link with the `privacyPolicyUrl` prop, with a fallback default

## 4. GeneralContent Data Fetching

- [x] 4.1 Add `GeneralContent` fetch to the composition root server module (verify `compositionRoot.general.getContent.execute()` works via `runFuture`)
- [x] 4.2 Create a shared helper (e.g., `getGeneralContent()` in `src/lib/`) that fetches and caches `GeneralContent` so pages don't duplicate the fetch logic

## 5. Validation

- [x] 5.1 Run `astro build` and inspect generated HTML to verify all meta tags are present in each page's `<head>`
- [x] 5.2 Verify Header abbreviation/glossary links point to real DHIS2 file URLs in the built output
- [x] 5.3 Verify Footer disclaimer and privacy policy link match DHIS2 `GeneralContent` values
- [x] 5.4 Run `yarn lint` and `yarn test` — fix any issues
