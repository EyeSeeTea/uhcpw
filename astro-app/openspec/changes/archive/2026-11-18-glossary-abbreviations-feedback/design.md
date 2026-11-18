## Context

The Glossary and Abbreviations pages are static Astro pages built from two DHIS2 event programs. Their search field sat in the page body with a visible label. The glossary used its own column gap and a "#" link per entry. The abbreviations page used a two-column list filled top to bottom, blue bold abbreviations and category headings inside a blue box. The client asked to align both pages with the Resources and Methods pages and with each other.

## Goals / Non-Goals

**Goals:**

- Reuse the existing look of the Resources search box and the Methods headings, columns and spacing.
- Keep one presentation for the entries of both pages.
- Keep the existing client behavior (`reference-terms-client.ts`) unchanged.

**Non-Goals:**

- A downloadable PDF of each page.
- Changes to stored content or DHIS2 metadata.

## Decisions

### 1. Search field in the title banner

**Choice:** `PageBanner` gains an optional `search` slot. When it is filled, the slot content is centred on the bottom edge of the banner, 442px wide and at most 70% of the width, as on the Resources page. On small screens the banner gets 48px of vertical padding to make room for it, as on the Resources page. Pages without the slot render as before.

The field is a shared `ReferenceSearch` component. Its label is visually hidden and repeated as placeholder, as the Resources search box has no visible label. The abbreviations page uses a shorter placeholder so it fits on mobile.

The `data-reference-page` root now wraps the banner too, so the client script still finds the field inside its root. The clear button moves next to the other controls above the entries.

**Alternatives considered:**

- Reuse the SPA `SearchInput` component as a React island. Rejected because the field needs no React and it uses `makeStyles`.

### 2. One entry presentation for both pages

**Choice:** both pages use a `.reference-entries` grid with two equal columns, a 40px column gap and the text at 95% of the column, as on the Methods page. The grid fills rows left to right. The term is a heading in the Methods heading style (24px, regular weight, black). The definition or meaning follows in the Methods text style (14px).

Entries keep the line below each row, already approved for these pages. Each entry has 20px of padding above and below the line. The space between two entries is 41px against 40px on the Methods page. The extra pixel is the line.

The grid switches to one column at 600px or less, the Methods breakpoint.

### 3. Category headings in the Methods style

**Choice:** category headings use the Methods heading style with no background. There are 10px from a category heading to its first term, as from a Methods heading to its text. The list moves up 10px to offset the 20px top padding of the entries. This keeps the line and the row spacing unchanged, including when search hides some entries.

### 4. The term is the fragment link

**Choice:** the "#" symbol is removed. The term heading links to its own fragment, styled like the heading and underlined on hover. Abbreviations work the same way. Fragment navigation in the client script is unchanged.

### 5. Upper-case start of definitions

**Choice:** a `buildGlossaryEntries` view helper sorts the entries, assigns fragment ids and initials and starts each definition with an upper-case letter. It follows the existing `buildAbbreviationGroups` helper. The stored content keeps its original case, so editors in DHIS2 do not need to change it.

`serializeGlossaryMarkdown` uses the same helper, as `serializeAbbreviationsMarkdown` uses `buildAbbreviationGroups`. The sort order and the upper-case start are defined in one place, and `/glossary.md` shows the definitions like the page. The serializer no longer trims the definition, as the repository already trims it.

### 6. Floating back-to-top button

**Choice:** both pages use the shared `ScrollToTopButton` with its default threshold of 200px. It replaces the glossary's static link and its mobile-only button. The button is wrapped in a `.back-to-top` element that is hidden in print.

The island entry lives in `src/islands/reference-terms/` and re-exports the shared component. In development, Vite does not serve a component from the parent `src/` as an island entry, so the button did not load in `astro dev`. Buttons do not inherit the font by default, so the page sets `font-family: inherit` on them to render the button in Lato.

## Risks / Trade-offs

- With the line below each row, the shorter entry of a row shows empty space above its line. The grid gives both entries of a row the height of the taller one. Methods has the same row heights, but no line makes it visible.
