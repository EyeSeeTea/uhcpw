## 1. Setup

- [x] 1.1 [FE] Create `src/lib/llms-txt/home-summary.md` with a 5–10 line hand-authored summary of UHC Watch (scope, audience, what the site offers). Colocated with the serializer module since it is an implementation detail of this feature.
- [x] 1.2 [FE] Create `src/lib/llms-txt/` module folder to hold serializer helpers. No new npm dependencies.

## 2. Serializer utilities (pure functions)

- [x] 2.1 [FE] Implement `serializeHomeMarkdown(summary: string, title: string): string` in `src/lib/llms-txt/serializers.ts`. Output: `# {title}\n\n{summary}\n`.
- [x] 2.2 [FE] Implement `serializeAboutMarkdown(data: AboutPageData, title: string): string`. Output: H1 title, `officeInfo.officeText` body, `## Team` bullets, `## Experts` bullets (with country).
- [x] 2.3 [FE] Implement `serializeMethodsMarkdown(data: MethodsPageData, title: string): string`. Output: H1 "Methods", per-method `## {sectionName}` followed by `method.text` (falling back to `shortText` when empty) — avoids CMS duplication.
- [x] 2.4 [FE] Implement `serializeLlmsTxt({ pages, externalResources, summary, title }): string`. Output matches the structure in design.md §Decision 4.
- [x] 2.5 [FE] Implement `serializeAreaOverviewMarkdown(features, title)` over a narrow `AreaMarkerFeature` type. Filters out areas without a summary; uses exhaustive `Record<FinancialProtectionStatus, string>` for status labels.
- [x] 2.6 [FE] Ensure all serializers are pure (no I/O) and use `map`/`flatMap`/`filter` over imperative loops per project code style.

## 3. Astro endpoints

- [x] 3.1 [FE] Register `/area-overview` in `seoRouteConfigs` (`src/domain/entities/SeoConfig.ts`) so `/llms.txt` and `/area-overview.md` share a single source of truth for title + description.
- [x] 3.2 [FE] Add `src/pages/llms.txt.ts` exporting `GET`. Load general content, compose per-page entries using `getSeoConfigForRoute()` for each curated route (`/`, `/about`, `/methods`, `/area-overview`), call `serializeLlmsTxt`, and return `new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } })`. External resources ("Abbreviations" / "Glossary") render with no description suffix.
- [x] 3.3 [FE] Add `src/pages/index.md.ts`, `about.md.ts`, `methods.md.ts`, `area-overview.md.ts` exporting `GET`. Each resolves its title via `getSeoConfigForRoute()` and returns `text/markdown; charset=utf-8`.

## 4. Tests

- [x] 4.1 [FE] Unit-test each serializer in `src/lib/llms-txt/__tests__/serializers.test.ts` — cover every scenario in `specs/llms-txt/spec.md` (heading structure, optional section, team+experts bullets, methods dedup, country filtering, no HTML chrome, etc.).
- [x] 4.2 [FE] Add `src/data/__tests__/general-content.test.ts` covering `resolveGeneralContentUrls` fallback behavior (undefined input, empty URLs).
- [x] 4.3 [FE] No build-output tests. Serializer unit tests are the behavioral source of truth; asserting against `dist/` only exercises Astro's static-emission plumbing, not our code. If needed later, add a post-build smoke script in CI rather than mixing it into `yarn test`.

## 5. Verification

- [x] 5.1 [FE] Run `yarn lint`, `yarn astro check`, `yarn test`, `yarn build` — lint and tests pass; astro check reports only pre-existing errors in `src/islands/home/HomeMapDesktop.tsx` (React 17/18 JSX typing) that are unrelated.
- [x] 5.2 [FE] Run `yarn build && yarn preview`; curl every endpoint, confirm status 200 + correct `Content-Type` prefix.
- [x] 5.3 [FE] Manually validate the generated `/llms.txt` against the llmstxt.org reference format (H1, blockquote, H2 sections with markdown links).
- [x] 5.4 [CR] Confirm only additive changes to existing files: `seoRouteConfigs` gains one entry; no `.astro`, layout, or component is modified.

## 6. Docs

- [x] 6.1 [FE] Add an "LLM-friendly endpoints" section in `README.md` with the endpoint table and a charset note for static hosts.
- [x] 6.2 [FE] Update design.md and spec.md to match the final shape (dropped the unreachable "omitted without SEO config" scenario, dropped the untestable "byte-identical HTML" scenario, documented the `seoRouteConfigs` registration pattern for companion-only routes).
