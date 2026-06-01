## 1. Dependencies & Assets

- [x] 1.1 Install `marked` and `@types/marked` in astro-app
- [x] 1.2 Copy `bubble-pattern-white.png` and `map-background.jpg` to `astro-app/src/assets/`

## 2. Markdown Rendering Utility

- [x] 2.1 Create `astro-app/src/lib/markdown.ts` — export a `renderMarkdown(md: string): string` function using `marked` that converts markdown to HTML at build time
- [x] 2.2 Add Vitest test for `renderMarkdown` covering paragraphs, lists, and links

## 3. Methods Page — Data Fetching

- [x] 3.1 Update `methods.astro` frontmatter to fetch methods and general content in parallel via `Promise.all` + `runFuture`
- [x] 3.2 Extract abbreviations/glossary URLs from general content with fallback to hardcoded `cmyn.short.gy` URLs

## 4. Methods Page — Title Banner

- [x] 4.1 Create the title banner section with accent-primary background, white "Methods" heading, and bubble pattern overlay image
- [x] 4.2 Add responsive styles: map background on mobile (≤ 600px), solid color + bubble on desktop

## 5. Methods Page — Method Sections Grid

- [x] 5.1 Implement two-column CSS Grid with `grid-auto-flow: column` and calculated `grid-template-rows` based on method count
- [x] 5.2 Add responsive collapse to single column at ≤ 600px
- [x] 5.3 Render each method section: heading, short text as markdown HTML, `<details>`/`<summary>` for expand/collapse with full text

## 6. Methods Page — Expand/Collapse Styling

- [x] 6.1 Style `<details>`/`<summary>` to match the SPA's "Read more" / "Read less" appearance — accent-primary color, chevron icon, bold text, no default marker
- [x] 6.2 Toggle summary text between "Read more" (with down chevron) and "Read less" (with up chevron) using CSS `:open` / `[open]` selectors

## 7. Methods Page — Reference Links & Content Area

- [x] 7.1 Render Abbreviations and Glossary pill-shaped download links with `target="_blank"`
- [x] 7.2 Style main content area with correct padding (80px 64px desktop, 40px mobile)
- [x] 7.3 Apply typography styles to rendered markdown containers (body2 font size, list padding, link colors)

## 8. Validation

- [x] 8.1 Run `astro build` and verify the generated `/methods/index.html` contains real DHIS2 data and no `<script>` tags
- [x] 8.2 Visual comparison with the React SPA Methods page at desktop, tablet, and mobile viewports
- [x] 8.3 Verify `yarn lint` and `yarn test` pass
