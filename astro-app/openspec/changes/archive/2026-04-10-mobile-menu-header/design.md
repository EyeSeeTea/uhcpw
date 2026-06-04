## Context

The Astro PoC is porting the React SPA's UI to a static Astro site while reusing the shared domain/data layers in `../src`. The header already renders a desktop dropdown (`DesktopNav.astro`) and a mobile `<details>`-based menu (`MobileNav.astro`). On mobile, the SPA exposes two behaviors that the Astro port has not yet replicated:

1. Tapping **Regional overview** opens a CMS-driven disclaimer modal (`PopUp` component, sourced from `GeneralContent.regionalPageMobilePopUp`).
2. Tapping **Countries & areas** expands an inline accordion with the full list of countries, marked by an expand/collapse caret.

The Astro nav data (`src/data/navigation.ts`) already builds `children` arrays for both items via the server composition root, but `MobileNav.astro` currently ignores them and renders flat links.

The shared `GeneralContent` entity (`src/domain/entities/GeneralContent.ts`) already exposes `regionalPageMobilePopUp: { disclaimer, buttonText, url }`. The Astro projection `astro-app/src/data/general-content.ts` only forwards `abbreviations` and `glossary` URLs today.

## Goals / Non-Goals

**Goals:**
- Match the SPA's mobile interaction model for the two items above using framework-free Astro + minimal vanilla JS.
- Reuse existing server-side data flow: extend `general-content.ts`, propagate from layout into `MobileNav`.
- Keep the header LCP-friendly: no additional client-side framework, no extra blocking scripts.
- Stay accessible: native semantics, focus management on modal open/close, ESC to close.

**Non-Goals:**
- Building a reusable modal component library.
- Adding desktop changes; `DesktopNav.astro` already has its own dropdown behavior.
- Implementing the SPA's "regional submenu accordion when already on the regional page" branch.
- Migrating `MobileNav.astro` to a React island.

## Decisions

### D1. Submenu accordion uses nested `<details>` rather than custom JS state

`MobileNav.astro` already wraps the whole menu in `<details>`. For child items with `children`, we render a nested `<details><summary>label + caret</summary>…</details>` block. The browser handles open/close state for free; CSS rotates the caret based on `[open]`. This matches the existing pattern and avoids growing the script.

**Alternatives considered:**
- A button + script-toggled `hidden` panel (like `DesktopNav.astro`). Rejected: more JS to maintain, no accessibility benefit over native `<details>`.
- A React island wrapping `MobileMenuSubItem` from the SPA. Rejected: pulls Material-UI into the header bundle, contradicts the static-site goal.

**Trade-off:** Nested `<details>` inside an outer `<details>` is uncommon but valid HTML. We need to ensure the outer "click outside to close" handler does not collapse the inner one when the user taps a child.

### D2. Regional overview modal uses native `<dialog>`

We render a `<dialog>` element inside `MobileNav.astro` (so it lives in the same DOM subtree as the trigger). A small script calls `dialog.showModal()` on click and `dialog.close()` on the close button / ESC / backdrop click. The disclaimer text is server-rendered as HTML using the existing markdown rendering used elsewhere in the Astro app (the same renderer used for footer disclaimers).

**Alternatives considered:**
- A custom-positioned `<div role="dialog">` with manual focus trap. Rejected: native `<dialog>` provides backdrop, top-layer rendering, and ESC handling out of the box.
- Mounting the SPA's `PopUp` React component as an island. Rejected: introduces Material-UI Dialog into the header bundle.

**Trade-off:** `<dialog>` styling needs explicit `::backdrop` rules. Browser support is universal in current evergreen browsers, which matches the project's existing baseline.

### D3. The Regional overview entry behaves differently from other `children` items

`Regional overview` has `children` in nav data (used by `DesktopNav.astro`). On mobile we explicitly want a modal trigger, not an accordion. `MobileNav.astro` treats the item by label (`"Regional overview"`) as a special case that renders a `<button>` opening the dialog instead of a `<details>` accordion. The `children` of this item are ignored on mobile, which mirrors SPA behavior.

**Alternatives considered:**
- Adding a discriminator field on `NavItem` (e.g. `mobileBehavior: "modal" | "accordion" | "link"`). Rejected as over-generalisation for a single item, but noted as a future option if more items need custom mobile behaviors.

### D4. Disclaimer content flows server-side from `GeneralContent`

`general-content.ts` adds a `resolveRegionalDisclaimer(generalContent)` helper returning `{ disclaimerHtml, buttonText, buttonUrl } | undefined`. The base layout fetches `GeneralContent` (already done for footer/abbreviations/glossary) and passes the resolved object into `Header.astro`, which forwards it to `MobileNav.astro`. If the entity is missing or the disclaimer is empty, the trigger falls back to a plain link to `/regional-overview` (so the menu never breaks the page).

### D5. Markdown rendering happens at build time

The disclaimer is rendered to HTML in the Astro frontmatter (`getMarkdownRenderer` or whatever the existing helper is) and emitted as a static string inside the dialog. No client-side markdown library is shipped.

### D6. Accordion state and modal state are independent of the outer menu

The existing outer menu's "click outside closes" handler must:
- Not close when the user interacts with a nested `<details>` summary.
- Close the outer menu when the user opens the modal (so the modal isn't behind a backdrop intersected by the menu panel).
- Close the modal but NOT the outer menu when the user presses ESC inside the modal (matches SPA, where closing the popup leaves the user where they were).

We will encode these by stopping propagation on summary clicks for nested details and by intentionally calling `outerNav.open = false` right before `dialog.showModal()`.

## Data flow

1. **Build time (composition root)** — `getServerCompositionRoot()` exposes `generalContent.get` (shared, already wired). `Layout.astro` (or whichever layout the header uses) calls it once per build.
2. **Build time (data projection)** — `resolveGeneralContentUrls` is extended (or a sibling helper added) to also produce `RegionalDisclaimer | undefined`. Markdown is rendered to HTML here.
3. **Build time (rendering)** — Header.astro receives `regionalDisclaimer` as a prop, passes it to `MobileNav.astro`. The dialog markup is server-rendered with the HTML inline; if `regionalDisclaimer` is undefined the dialog is not rendered and the trigger becomes an `<a href="/regional-overview">`.
4. **Client runtime** — Vanilla script in `MobileNav.astro` wires the trigger button to `dialog.showModal()`, the close button to `dialog.close()`, and the backdrop click to close. Nested `<details>` handle their own open/close.

This keeps all the layered architecture concerns (Domain → Application → Data) untouched; only the Astro UI projection layer changes.

## UI Design Gate

The project rule normally requires Pencil mockups for user-facing UI changes. We are intentionally skipping that step here because:
- The SPA is the canonical visual reference, and the change is a parity port — we replicate behavior the user already sees in the live SPA at `localhost:8081`.
- Verification will be done via the `visual-compare` skill against the SPA mobile menu at 375px / 768px viewports.

If the visual-compare run reveals layout disagreements that need invented design (rather than parity), we will pause to produce a Pencil mockup before committing CSS changes.

## Risks / Trade-offs

- **Nested `<details>` styling quirks** → Mitigation: scope styles tightly, test in Chrome and Firefox via the visual-compare skill at 375px viewport.
- **`<dialog>` browser inconsistencies** → Mitigation: rely only on `showModal()` / `close()` / `::backdrop`, all of which are stable in evergreen browsers used by the SPA's current audience.
- **Missing `GeneralContent` at build** → Mitigation: trigger falls back to a plain `/regional-overview` link instead of throwing.
- **Outer menu closing while modal is open** → Mitigation: explicitly close the outer `<details>` when opening the modal; the modal becomes the focused surface.
- **Country list length** → The list can be long. Mitigation: cap nested accordion panel `max-height` and allow `overflow-y: auto` (matches SPA's `maxHeight: 558` on `MobileMenuSubItem`).
- **Accessibility regressions** → Mitigation: keep `aria-haspopup="dialog"` on the regional trigger, ensure the dialog has `aria-labelledby`, and verify keyboard nav and focus return.

## Migration Plan

1. Land `general-content.ts` change first (purely additive, no UI consumers).
2. Land `Header.astro` + `MobileNav.astro` changes together with the spec delta.
3. Run `yarn build && yarn astro check`.
4. Run the visual-compare skill against the SPA mobile menu at 375px and 768px.
5. Open a PR; no feature flag.

Rollback: revert the three files. The composition root and shared entities are unchanged.

## Open Questions

- Should the modal include the SPA's external-link analytics tracking (`useAnalytics().redirectWithExternalLink`)? **Tentative answer:** yes — wire the disclaimer button click through the existing Astro analytics helper if one exists, otherwise emit a normal `target="_blank"` link and follow up.
- Does the existing markdown helper handle GFM/lists the same way `react-markdown` did in the SPA? **To verify** during implementation; if not, fall back to a plain `<p>` rendering of the disclaimer text and file a follow-up.
