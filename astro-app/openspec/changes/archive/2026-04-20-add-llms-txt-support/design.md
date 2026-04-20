## Context

UHC Watch's Astro build produces static HTML pages at `/`, `/about`, `/methods`, and `/404`. Page content originates from two sources:

- **CMS-authored markdown** fetched at build time via the shared composition root (`getMethodsPageData()`, `getAboutPageData()`). `method.shortText`, `method.text`, and `officeInfo.officeText` are raw markdown strings rendered with `marked` (`src/lib/markdown.ts`).
- **Structured data** (team members, experts, country tree, regional map) rendered through Astro/React components with no native markdown form.

No `llms.txt` file or markdown companion endpoints exist today. The llmstxt.org proposal is an emerging spec (not IETF-ratified); adopting it is a low-risk, additive experiment.

## Goals / Non-Goals

**Goals:**
- Ship a static `/llms.txt` at the site root that conforms to the llmstxt.org format.
- Ship a clean markdown companion per content page (`/about.md`, `/methods.md`, `/index.md`) with prose content only, no HTML/CSS/JS chrome.
- Keep a single source of truth: reuse the markdown strings already fetched for the React/Astro pages — do not author content twice.
- Emit files as part of `yarn build` with the correct `Content-Type` so they work behind any static host (Astro's built-in preview, nginx, CDN).

**Non-Goals:**
- Dynamic generation on each request (the app is a static build).
- A full "expanded" version (`llms-full.txt`) combining every page into one file — out of scope for the PoC; revisit if there is demand.
- Authoring new editorial content. If a page has no natural prose (e.g. 404), it gets a minimal placeholder or is omitted from the index.
- Backfilling markdown for dynamic widgets (map, expert filter UI). The companion files describe what the page *is about*, not a UI transcription.

## Decisions

### Decision 1: One Astro endpoint per file, not a single aggregator

Use individual Astro endpoint files under `src/pages/`:
- `src/pages/llms.txt.ts` → emits `/llms.txt`
- `src/pages/index.md.ts` → emits `/index.md`
- `src/pages/about.md.ts` → emits `/about.md`
- `src/pages/methods.md.ts` → emits `/methods.md`

Each exports a `GET` function returning a `Response` with `Content-Type: text/markdown; charset=utf-8` (or `text/plain` for `llms.txt` per the spec's recommendation — decided below).

**Alternatives considered:**
- A single build hook that writes files directly to `dist/`. Rejected: harder to develop against (not reachable via `astro dev`), and Astro endpoints already give us file emission + dev-mode preview for free.
- Content collections + `getStaticPaths`. Rejected: overkill for 3–4 fixed files; each page's data source is different, so a collection abstraction would leak.

### Decision 2: Derive markdown from existing data loaders

Reuse the same data functions the HTML pages already call:
- `/methods.md` ← `getMethodsPageData()` → serialize `methods[]` as `## {sectionName}\n\n{shortText}\n\n{text}`.
- `/about.md` ← `getAboutPageData()` → emit `officeInfo.officeText` as the body; render team/experts as a bulleted list of names + roles (markdown, not HTML).
- `/index.md` ← hand-authored short summary imported from `src/lib/llms-txt/home-summary.md` (colocated with the serializer module since it is an implementation detail of this feature, not shared content). Home prose doesn't exist in the CMS today, so a 5–10 line static summary is the pragmatic source.

This keeps the CMS as the source of truth for the two data-driven pages and isolates the one hand-written file.

**Alternatives considered:**
- HTML-to-markdown conversion using `turndown` on the rendered Astro output. Rejected: adds a dependency, pulls in chrome (nav/footer) that the scraper would have to strip, and lossy for dynamic islands.
- Maintain a separate markdown file per page in `src/content/`. Rejected for methods/about: duplicates CMS content and will drift.

### Decision 3: Content-Type — `text/plain` for `llms.txt`, `text/markdown` for `*.md`

The llmstxt.org proposal does not mandate a MIME type, but the file is named `.txt`, so LLMs and scrapers will expect `text/plain`. Per-page `.md` companions get `text/markdown; charset=utf-8` (RFC 7763) so browsers and curl render them as text, not download prompts.

### Decision 4: `llms.txt` structure

Follow the spec's ordered format:

```
# UHC Watch

> Short blockquote summary (1–2 sentences) pulled from the home SEO description.

## Pages

- [UHC Watch](/index.md): <home SEO description>
- [UHC Watch - About](/about.md): <about SEO description>
- [UHC Watch - Methods](/methods.md): <methods SEO description>
- [UHC Watch - Area overview](/area-overview.md): <area-overview SEO description>

## Optional

- [Abbreviations](<abbreviationsUrl>)
- [Glossary](<glossaryUrl>)
```

Page titles and descriptions come from `getSeoConfigForRoute()` so they stay in sync with meta tags. Companion-only routes (like `/area-overview`) register an entry in `seoRouteConfigs` even though they have no HTML page — this keeps SEO as the single source of truth for title/description. External resource URLs come from `resolveGeneralContentUrls(generalContent)` and render without a trailing description (the link label is self-explanatory).

### Decision 5: Data flow through Clean Architecture layers

No new domain layer is introduced. The endpoints live in the **UI layer** (`src/pages/`) and call existing application-layer loaders (`@/data/about/about-data`, `@/data/methods/methods-data`, `@/data/general-content`) which already own the composition-root wiring and Future bridging. Markdown formatting is a **presentation concern** and lives in a small helper (`src/lib/llms-txt/serializers.ts` or similar) — pure functions that take domain entities and return strings.

### Decision 6: No `llms.txt` entry in robots.txt / sitemap

The spec recommends discovery by convention only. Adding it to the sitemap risks confusing search engines that treat `text/plain` indexed files as thin content. Revisit if adoption grows.

## Risks / Trade-offs

- **Spec churn** → llmstxt.org is young and may evolve. Mitigation: keep the serializer isolated and well-tested so format tweaks are a one-file edit.
- **Content drift between HTML and markdown companions** → the `.md` endpoints call the same loaders as the `.astro` pages, so build-time data is identical. Risk is limited to formatting divergence, covered by unit tests on the serializer.
- **Dynamic content (experts, countries) won't be fully represented** → acceptable trade-off; the companion files cover the editorial prose, and LLMs can still crawl HTML for dynamic widgets.
- **Host-level `Content-Type` override** → some static hosts serve `.md` as `application/octet-stream`. Astro endpoints return `Response` objects with explicit headers, which the Astro static adapter writes as `_headers`/meta. If the target host ignores this, document the required host config in `docs/`.
- **Translations** → only English content exists today. If i18n is added, `llms.txt` and companions need per-locale variants (`/en/llms.txt`). Out of scope now; flagged for later.

## Migration Plan

1. Land the serializer utilities + endpoints in a single PR behind no flag (pure addition).
2. Verify `yarn build` emits `dist/llms.txt`, `dist/index.md`, `dist/about.md`, `dist/methods.md`.
3. Verify `yarn start` serves the same paths with correct content types.
4. Validate the generated `/llms.txt` against the llmstxt.org reference parser (or a simple markdown-structure assertion).

**Rollback:** delete the four new `src/pages/*.ts` files and the serializer module. No data changes, no config changes, no dependencies added.

## Open Questions

- Should home-page summary content live in `src/content/home-summary.md` (committed, hand-authored) or move into the CMS under a new `generalContent.homeDescription` field? For the PoC: start static; revisit when/if the CMS schema can grow.
- Do we want a `llms-full.txt` (inlined full content of every page) in addition to the index? Defer — ship the index first, measure adoption.
