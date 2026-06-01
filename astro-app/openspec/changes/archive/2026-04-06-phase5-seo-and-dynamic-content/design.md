## Context

The Astro POC currently has About and Methods pages rendering with real DHIS2 data, but:

1. **No SEO meta tags** — Layout.astro only sets `<title>`. No description, OG, Twitter Card, or canonical tags.
2. **Hardcoded Header/Footer** — The SPA fetches `GeneralContent` from DHIS2 for abbreviation/glossary links, footer disclaimer, and cookie policy URL. The Astro versions have these values hardcoded.

The SPA already has a well-defined `SeoConfig` entity (`src/domain/entities/SeoConfig.ts`) with route-based config and a `GeneralContent` entity with footer/header data. Both are reusable.

**Current data flow:**
- Pages fetch domain data (methods, persons) → pass to Layout via `title` prop → Layout renders `<title>` only.
- Header.astro and Footer.astro receive no props — all content is static.

## Goals / Non-Goals

**Goals:**
- All pages emit complete SEO meta tags (title, description, OG, Twitter Card, canonical).
- Header abbreviation/glossary links come from DHIS2 `GeneralContent` at build time.
- Footer disclaimer and privacy policy URL come from DHIS2 `GeneralContent` at build time.
- New pages added in the future get SEO support by simply passing a route path.

**Non-Goals:**
- Responsive testing (done in earlier phases).
- Performance/bundle audit (separate follow-up).
- i18n or localization.
- Dynamic (runtime) content — everything remains SSG/build-time.

## Decisions

### 1. Custom `SeoHead.astro` component over third-party package

**Choice:** Build a simple `SeoHead.astro` component rather than adding `@codiume/astro-seo-meta`.

**Rationale:** The SPA's `SeoConfig` entity already defines the exact shape we need. A custom component is ~30 lines, avoids a new dependency, and directly consumes the shared entity. The third-party package adds indirection for no gain.

**Alternative considered:** `@codiume/astro-seo-meta` — it abstracts OG/Twitter tags but requires mapping our `SeoConfig` into its format, and it's a small unmaintained package.

### 2. SEO config reused from shared domain entity

**Choice:** Import `getSeoConfigForRoute()` and `defaultSeoConfig` from `@shared/domain/entities/SeoConfig.ts` directly.

**Rationale:** The route-to-config mapping is already defined and matches all current + future routes. No duplication needed.

### 3. `GeneralContent` fetched once in Layout, passed down as props

**Choice:** Fetch `GeneralContent` via `compositionRoot.general.getContent.execute()` in each page's frontmatter and pass it to Layout as a prop. Layout passes relevant slices to Header and Footer.

**Rationale:** Astro layouts cannot have their own async frontmatter data fetching independent of pages — the page is the data-fetching boundary. Fetching in each page and passing down keeps the data flow explicit. Since this is build-time only, the fetch is cached by the composition root singleton.

**Alternative considered:** Fetching in Layout directly — not possible in Astro's architecture (layouts don't have independent data loading).

### 4. Header and Footer receive props, not global state

**Choice:** Header gets `abbreviationsUrl` and `glossaryUrl` as props. Footer gets `disclaimer` and `privacyPolicyUrl` as props.

**Rationale:** Explicit prop passing is idiomatic Astro. No context/store needed for build-time data. Components remain pure and testable.

## Data Flow

```
Page frontmatter (about.astro, methods.astro, etc.)
  ├── fetches domain data (methods, persons, etc.)
  ├── fetches GeneralContent via compositionRoot.general.getContent
  ├── computes SeoConfig via getSeoConfigForRoute(Astro.url.pathname)
  └── passes to Layout.astro
        ├── SeoHead.astro (receives SeoConfig → renders meta tags in <head>)
        ├── Header.astro (receives abbreviationsUrl, glossaryUrl)
        └── Footer.astro (receives disclaimer, privacyPolicyUrl)
```

## Risks / Trade-offs

- **Repeated `GeneralContent` fetch in every page** → Mitigated by composition root singleton caching. Build-time only, so no runtime cost. If it becomes a problem, can extract to a shared data loader.
- **SeoConfig covers routes that don't exist in Astro yet** (e.g., `/policy-explorer`) → No harm — `getSeoConfigForRoute` falls back to defaults. The configs will be ready when those pages are added.
- **Canonical URL requires knowing the production domain** → Use `Astro.site` config (set in `astro.config.mjs`) or a `SITE_URL` env var.

## Open Questions

- Should `Astro.site` be set in `astro.config.mjs` now, or deferred until deployment? (Low risk — canonical tags are nice-to-have for a POC.)
