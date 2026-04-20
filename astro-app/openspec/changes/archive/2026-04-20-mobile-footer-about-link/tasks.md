## 1. Markup

- [x] 1.1 [FE] Remove the mobile `<details class="accordion mobile-only mobile-accordion-about">` block from `src/components/layout/Footer.astro`.
- [x] 1.2 [FE] Insert a new `<a class="mobile-only mobile-about-link" href="/about">About us</a>` in the mobile slot above the remaining accordions.

## 2. Styles

- [x] 2.1 [FE] In `Footer.astro`'s scoped `<style>`, update the ≤960px `grid-template-areas` to replace `acc-about` with an `about-link` row between the logos row and the other accordion rows.
- [x] 2.2 [FE] Drop the `.mobile-accordion-about { grid-area: acc-about; }` rule.
- [x] 2.3 [FE] Add `.mobile-about-link` styles matching the SPA pill (scoped inside the ≤960px media query so desktop keeps `.mobile-only { display: none }`): `min-height: 56px; padding: 0 16px; background: var(--color-accent-primary); color: var(--color-white); text-decoration: none; border: 1px solid rgba(255,255,255,0.2); border-radius: 20px; font-weight: 500; font-size: var(--font-size-lg); grid-area: about-link;`.

## 3. Visual parity adjustments

- [x] 3.1 [FE] Raise `.accordion-summary` to `min-height: 56px` with `padding: 12px 16px` so single-line rows render at 56px and multi-line titles (e.g. "WHO privacy policy & disclaimer") get symmetric vertical padding.
- [x] 3.2 [FE] Drop the per-item `margin: 8px 0` from `.accordion` and rely on the mobile grid's `row-gap: 8px` for spacing, so inter-row distance is 8px (was ~24px from stacked margin + gap + margin).
- [x] 3.3 [FE] Animate accordion expand/collapse via `interpolate-size: allow-keywords` + `::details-content { block-size 0 → auto; transition: block-size 250ms ease }`.
- [x] 3.4 [FE] Remove the mobile `justify-content: center` and the ≤600px `padding-inline-start: 1rem` override from `.footer-bottom` so the copyright text is left-aligned at 3.75rem on all widths, matching the SPA.
- [x] 3.5 [FE] Remove `.footer-grid { padding: 0 24px }` (and its ≤960px `padding: 0 8px` override) so the outer `.footer-top`'s 32px is the single source of horizontal inset, matching the SPA's measured 32px left gap.

## 4. Verification

- [x] 4.1 [FE] Run `yarn astro check` — no new errors; 3 pre-existing errors in `src/islands/home/HomeMapDesktop.tsx` unrelated to this change.
- [x] 4.2 [FE] Inspect dev server (port 4321) against the SPA (port 8081) at 375px via chrome-devtools MCP: `.footer-top` padding 48px 32px and first-child top/left gap of 48/32 match the SPA exactly.
- [x] 4.3 [FE] About-us link hidden on desktop (verified after moving pill styles inside the ≤960px media query to avoid overriding `.mobile-only { display: none }`).

## 5. Specs

- [x] 5.1 [FE] `openspec/changes/mobile-footer-about-link/specs/footer-chrome/spec.md` updated with scenarios for row sizing/spacing, accordion animation, bottom bar alignment, and grid padding; `openspec validate mobile-footer-about-link --strict` passes.
