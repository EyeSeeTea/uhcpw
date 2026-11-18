## 1. Search in the title banner

- [x] 1.1 [FE] Add an optional `search` slot to `PageBanner`, centred on the bottom edge of the banner as on the Resources page, with extra vertical padding on small screens.
- [x] 1.2 [FE] Create the shared `ReferenceSearch` component with a visually hidden label and the Resources search box look.
- [x] 1.3 [FE] Use it on both pages, wrap the banner in the `data-reference-page` root and move the clear button above the entries.

## 2. Glossary

- [x] 2.1 [FE] Match the Methods column widths and spacing.
- [x] 2.2 [FE] Remove the "#" symbol and make the term the fragment link.
- [x] 2.3 [FE] Add `buildGlossaryEntries` to start every definition with an upper-case letter, with a unit test.
- [x] 2.4 [FE] Use `buildGlossaryEntries` in `serializeGlossaryMarkdown`, with a test for the upper-case start in `/glossary.md`.

## 3. Abbreviations

- [x] 3.1 [FE] Show category headings in the Methods heading style, without the background box, 10px above the first term.
- [x] 3.2 [FE] Show abbreviations like glossary terms, in two columns ordered left to right.

## 4. Both pages

- [x] 4.1 [FE] Use the floating back-to-top button on both pages and remove the glossary's static link.
- [x] 4.2 [FE] Move the back-to-top island entry to `src/islands/reference-terms/` so it loads in `astro dev`.
- [x] 4.3 [FE] Render the back-to-top button in Lato.

## 5. Verification

- [x] 5.1 [FE] Check both pages in `astro dev` on desktop and mobile: search, filters, category links, fragment links, back-to-top button and fonts.
- [x] 5.2 [FE] Run `yarn lint` and `yarn astro check` from `astro-app/`. No new errors. The existing errors in other files remain.
- [x] 5.3 [FE] Run the test suite.
