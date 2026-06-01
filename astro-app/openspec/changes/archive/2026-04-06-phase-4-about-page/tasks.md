## 1. Configuration & Assets

- [x] 1.1 [FE] Configure `image.remotePatterns` in `astro.config.mjs` to allow the DHIS2 server hostname for remote image optimization
- [x] 1.2 [FE] Create the SVG avatar placeholder as an inline data URI constant in `src/lib/avatar-placeholder.ts`
- [x] 1.3 [FE] Copy `avatar-empty.png` from `../src/webapp/assets/` to `src/assets/` as a static fallback reference

## 2. Image Validation Utility

- [x] 2.1 [FE] Create `src/lib/image-validation.ts` — export `validateImageUrl(url: string): Promise<boolean>` that performs a HEAD request with 5s timeout and returns true for 2xx responses
- [x] 2.2 [FE] Export `validatePersonImages(persons: Person[]): Promise<Map<string, boolean>>` that validates all person image URLs in parallel using `Promise.allSettled`
- [x] 2.3 [FE] Add Vitest tests for `validateImageUrl` — mock fetch to test valid, 404, and timeout scenarios

## 3. Build-Time Data Layer

- [x] 3.1 [FE] Create `src/lib/about-data.ts` — export `getAboutPageData()` that fetches team, experts, officeInfo, countries, and generalContent in parallel via `Promise.all` + `runFuture`
- [x] 3.2 [FE] Implement `mapPersonsWithCountry(persons, countries)` — maps `Person[]` to `PersonState[]` by resolving `countryId` to `countryName`
- [x] 3.3 [FE] Implement team sorting (alphabetical by firstName) and expert sorting (Kosovo-last, then countryName, then firstName)
- [x] 3.4 [FE] Implement `buildCountryTreeOptions(countries)` — transforms countries to `TreeOption[]` matching `useMultiCountryOptionsV2` logic (parent groupings, "All countries and areas" root, income-parent filtering)
- [x] 3.5 [FE] Implement `buildParentSortOrder()` — computes the parentSort array from `SORTED_COUNTRY_GROUPINGS`
- [x] 3.6 [FE] Add Vitest tests for `mapPersonsWithCountry`, sorting logic, and `buildCountryTreeOptions`

## 4. Person Card — Astro Component (Team Section)

- [x] 4.1 [FE] Create `src/components/about/PersonCard.astro` — renders circular image, bold name (column layout for team), position (via `renderMarkdown`), optional institution, and country name
- [x] 4.2 [FE] Handle `\n` escape sequences in position/institution text before markdown rendering
- [x] 4.3 [FE] Implement image fallback: use Astro `<Image>` for valid URLs, inline SVG placeholder for invalid/missing URLs
- [x] 4.4 [FE] Add scoped CSS matching SPA styles: `object-fit: cover`, `object-position: 50% 0%`, `border-radius: 50%`, center-aligned text, Lato font

## 5. Office Header — Astro Component

- [x] 5.1 [FE] Create `src/components/about/OfficeHeader.astro` — two-column layout (image left, text right) with `gradientPrimary2` background and white text
- [x] 5.2 [FE] Render office image with Astro `<Image>`, wrapped in `<a>` linking to `officeVideo` with `target="_blank"`
- [x] 5.3 [FE] Render caption below image and `officeText` as markdown in the right column
- [x] 5.4 [FE] Add responsive styles: single-column stack at <= 959px, padding adjustments

## 6. Team Section — Astro Component

- [x] 6.1 [FE] Create `src/components/about/TeamSection.astro` — title "The WHO Barcelona Office team", subtitle "Staff and consultants", and responsive grid of PersonCard components
- [x] 6.2 [FE] Implement responsive grid: multi-column auto-fill on desktop, 2-column on mobile (< 960px)
- [x] 6.3 [FE] Style title/subtitle matching SPA: title font-weight 500, subtitle with 70% opacity text color

## 7. Experts Network — React Island

- [x] 7.1 [FE] Create `src/islands/ExpertsNetwork.tsx` — React component receiving `experts`, `countryOptions`, `parentSortOrder`, `title`, `subtitle` as props
- [x] 7.2 [FE] Implement client-side filtering: `useState` for selected countries, filter experts by `countryId` match (show all when no selection)
- [x] 7.3 [FE] Import and render `TreeSelector` from `../src/webapp/components/tree-selector/TreeSelector` with SPA-matching props (`hasSelectAll`, `hasClearAll`, `showParentIfChecked`, etc.)
- [x] 7.4 [FE] Create `src/islands/PersonCardReact.tsx` — React version of person card with `<img>` + `onError` fallback to SVG placeholder
- [x] 7.5 [FE] Implement responsive grid for expert cards using CSS Grid (not MUI Grid) to minimize MUI dependency surface
- [x] 7.6 [FE] Resolve TreeSelector import chain — verify `DropdownTextField`, `SelectedChip`, `FullScreenDialog`, and `useTreeSelector` all resolve without pulling in `useAppContext` or other SPA contexts
- [x] 7.7 [FE] Add Vitest tests for expert filtering logic and PersonCardReact onError fallback

## 8. About Page Assembly

- [x] 8.1 [FE] Update `src/pages/about.astro` — frontmatter calls `getAboutPageData()`, validates images, computes tree options
- [x] 8.2 [FE] Render page structure: title banner → gradient divider → OfficeHeader → TeamSection → gradient divider → ExpertsNetwork island (`client:only="react"`)
- [x] 8.3 [FE] Add `min-height` CSS on the experts section container to prevent layout shift before island hydration
- [x] 8.4 [FE] Pass serialized props to experts island: pre-computed experts[], countryOptions[], parentSortOrder[], title, subtitle

## 9. Validation & Testing

- [x] 9.1 [FE] Run `astro build` and verify `/about/index.html` contains real DHIS2 data in static sections (team names, office text)
- [x] 9.2 [FE] Verify experts island hydrates and TreeSelector filtering works in `astro preview`
- [x] 9.3 [FE] Visual comparison with the React SPA About page at desktop (>= 1280px), tablet (768px), and mobile (375px) viewports
- [x] 9.4 [FE] Verify static sections (header, team) contribute zero JS to the bundle
- [x] 9.5 [FE] Run `yarn lint` and `yarn test` — all pass
- [x] 9.6 [CR] Code review: verify island boundary is clean (no SPA context dependencies), image fallbacks work, and TreeSelector reuse is solid
