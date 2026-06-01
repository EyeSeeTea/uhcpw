## 1. Data layer

- [x] 1.1 [FE] Extend `astro-app/src/data/general-content.ts` to expose a `resolveRegionalDisclaimer(generalContent)` helper that returns `{ disclaimerHtml, buttonText, buttonUrl } | undefined` from `GeneralContent.regionalPageMobilePopUp`, rendering the disclaimer markdown to HTML at build time using the existing markdown helper.
- [x] 1.2 [FE] Confirm (and document inline) which markdown helper is reused; if none exists in the Astro app yet, fall back to plain-text rendering and note as a follow-up. (Reused `@/lib/markdown` — `marked` with GFM, the same renderer used by other CMS prose in the Astro app.)

## 2. Header wiring

- [x] 2.1 [FE] In the layout that currently fetches `GeneralContent` for the header, also resolve the regional disclaimer and pass it as a prop into `Header.astro`.
- [x] 2.2 [FE] In `Header.astro`, forward the `regionalDisclaimer` prop to `MobileNav.astro`.

## 3. MobileNav: Countries & areas accordion

- [x] 3.1 [FE] Update `MobileNav.astro` to render any nav item with `children` (other than "Regional overview") as a nested `<details>` block: `<summary>` shows label + caret SVG, body lists child links.
- [x] 3.2 [FE] Add scoped CSS for the accordion: caret rotation on `[open]`, indented child links matching the existing `.menu-link` palette, capped `max-height` with `overflow-y: auto` for long lists.
- [x] 3.3 [FE] Ensure tapping a child link closes the outer mobile menu (extend the existing `.menu-link` click handler to cover nested links). (Selector tightened to `a.menu-link` so it covers both top-level and nested links without intercepting the modal trigger button.)
- [x] 3.4 [FE] Stop click propagation on nested `<summary>` so the outer "click outside closes" handler does not fire when expanding a submenu. (Verified in browser: nested `<details>` is inside `nav.contains(e.target)`, so the outer document handler already does the right thing without needing explicit `stopPropagation`.)

## 4. MobileNav: Regional overview modal

- [x] 4.1 [FE] In `MobileNav.astro`, render the "Regional overview" item as a `<button type="button">` (not a link or a `<details>`) when `regionalDisclaimer` is provided; otherwise render a plain link to `/regional-overview`.
- [x] 4.2 [FE] Render a `<dialog>` element inside `MobileNav.astro` containing the server-rendered disclaimer HTML, an optional CTA button (`buttonText` → `buttonUrl`, `target="_blank" rel="noreferrer"`), and a close button.
- [x] 4.3 [FE] Add a small inline script that opens the dialog with `showModal()` on the trigger click, closes it on the close button, on backdrop click, and on ESC. Closing the outer mobile `<details>` before opening the dialog so the menu does not stay visible behind the backdrop.
- [x] 4.4 [FE] Add scoped CSS for the dialog (max-width, padding, `::backdrop`, mobile-friendly typography).
- [x] 4.5 [FE] Ensure focus returns to a sensible target after the dialog closes. **Spec amended:** the original "Regional overview" trigger lives inside the collapsed mobile menu after open, so it is not focusable; focus returns to the hamburger toggle (the closest visible entry point) via a `close` event handler deferred with `requestAnimationFrame` so it runs after Chromium's native focus-restore step. Both the canonical and delta `header-chrome` specs were updated to match.
- [x] 4.6 [FE] Wire the CTA button click through the existing analytics helper (if present) for parity with the SPA's `redirectWithExternalLink`; otherwise leave a `// TODO analytics` comment and file a follow-up. (No `redirectWithExternalLink`-equivalent helper exists in the Astro app yet — only the GA4 bootstrap in `Analytics.astro`. The CTA renders as a normal `target="_blank" rel="noreferrer"` link; analytics tracking can be a follow-up if/when the Astro app introduces an external-link helper.)

## 5. Specs

- [x] 5.1 [FE] Update `openspec/specs/header-chrome/spec.md` per the delta in `specs/header-chrome/spec.md` (modify "Header displays mobile navigation" requirement and add new scenarios).

## 6. Verification

- [x] 6.1 [FE] Run `yarn astro check` and `yarn build` from `astro-app/`; both must pass. (`astro check` 0 errors / 0 warnings; `yarn build` succeeded; rendered HTML contains the new submenu, modal trigger, and dialog markup.)
- [x] 6.2 [FE] Run `yarn lint` from `astro-app/`; no new warnings. (`eslint src/` clean.)
- [x] 6.3 [FE] Use the `visual-compare` skill (chrome-devtools-mcp) to compare Astro vs SPA mobile menus at 375px. Verified: closed menu, open menu, "Countries & areas" expanded with caret, "Regional overview" modal open with disclaimer + CTA. Astro matches SPA palette and item order.
- [x] 6.4 [FE] Manual keyboard / programmatic pass: hamburger opens menu, Regional overview button opens dialog (collapsing outer menu), Esc closes dialog, focus returns to hamburger toggle (verified `document.activeElement === summary.menu-toggle`).
- [x] 6.5 [CR] Code review against project conventions: Astro scoped styles (no `is:global`), no new runtime dependencies, declarative `.map(...)` in frontmatter, `Readonly<T>` data shape on the new `RegionalDisclaimer` type, no SPA refactors.

## 7. Follow-ups (out of scope, file as separate changes if needed)

- [x] 7.1 ~~If `NavItem.children` for "Regional overview" is not used by any consumer after this change, propose removing it in a separate cleanup change.~~ **Not applicable** — `DesktopNav.astro` still uses `children` for the desktop dropdown. Only mobile ignores them in favour of the modal.
- [x] 7.2 ~~If a generalised mobile-behavior discriminator on `NavItem` becomes useful (more items want custom mobile behaviors), propose it as a separate refactor.~~ **Not needed** — no other items require custom mobile behavior.
- [ ] 7.3 If/when the Astro app gains an external-link analytics helper equivalent to the SPA's `redirectWithExternalLink`, wire the regional modal CTA through it.
