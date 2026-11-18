## Why

The client reviewed the new Glossary and Abbreviations pages and asked for changes so both pages look like the rest of the site. The search field should sit in the page header as on the Resources page. Columns, spacing and headings should match the Methods page. Both pages should show their entries the same way.

## What Changes

- Place the search field on the bottom edge of the title banner on both pages, with the look of the Resources page search box.
- Glossary: match the column widths and spacing of the Methods page.
- Glossary: remove the "#" link symbol. The term itself becomes the entry's fragment link.
- Glossary: start every definition with an upper-case letter, whatever the case of the stored content. The markdown companion `/glossary.md` shows them the same way.
- Abbreviations: show category headings in the Methods heading style, without the blue background box.
- Abbreviations: show each abbreviation like a glossary term. The abbreviation is a black heading with its meaning below, in two columns ordered left to right.
- Both pages: offer the site's floating back-to-top button once the user scrolls down. It replaces the glossary's static link at the end of the page.
- Both pages: render the back-to-top button in the site font (Lato).
- Both pages: switch to one column at 600px or less, as on the Methods page.

## Goals and Non-goals

### Goals

- Make both reference pages consistent with each other and with the Resources and Methods pages.
- Keep search, letter filter, category links, fragment links and expand or collapse behavior unchanged.

### Non-goals

- A downloadable PDF of the glossary or the abbreviations. It is estimated separately.
- Changes to the DHIS2 metadata or to the stored content.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `reference-terms-pages`: presentation of both pages, the search placement, the term as fragment link and the upper-case start of definitions.

## Impact

- **Affected code:** `src/pages/glossary.astro`, `src/pages/abbreviations.astro`, `src/styles/reference-terms.css`, `src/components/layout/PageBanner.astro`, `src/data/reference-terms/reference-terms-view.ts`, `src/lib/llms-txt/serializers.ts`.
- **New files:** `src/components/reference-terms/ReferenceSearch.astro`, the search field shared by both pages. `src/islands/reference-terms/ScrollToTopButton.tsx`, the island entry for the shared back-to-top button.
- **Dependencies and public interfaces:** no new dependencies. `PageBanner` gains an optional `search` slot. Pages without it render as before.

## User Impact

Visitors find the search field in the same place as on the Resources page. Both pages read the same way. A back-to-top button appears once the user scrolls down.

## Rollback Plan

Revert the change. No data or stored state is involved.
