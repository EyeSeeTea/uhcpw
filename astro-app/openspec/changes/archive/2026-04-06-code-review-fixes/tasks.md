## 1. Remove dead code

- [x] 1.1 [FE] Delete `src/data/about/image-validation.ts`
- [x] 1.2 [FE] Delete `src/lib/__tests__/shared-imports.test.ts`

## 2. Extract shared utilities

- [x] 2.1 [FE] Create `src/lib/url.ts` with `normalizeUrl` function
- [x] 2.2 [FE] Create `src/data/about/constants.ts` with `AVATAR_FALLBACK` export
- [x] 2.3 [FE] Create `src/data/navigation.ts` with shared `NavItem` type and `navItems` array (including regions/countries)
- [x] 2.4 [FE] Create `src/data/general-content.ts` with `resolveGeneralContentUrls` helper (applies fallbacks + normalization)

## 3. Update consumers to use shared utilities

- [x] 3.1 [FE] Update `Layout.astro` — replace inline `normalizeUrl` with import from `lib/url.ts`, use `resolveGeneralContentUrls`
- [x] 3.2 [FE] Update `methods.astro` — remove inline URL computation, use `resolveGeneralContentUrls`
- [x] 3.3 [FE] Update `PersonCard.astro` — import `AVATAR_FALLBACK` from `data/about/constants.ts`, remove inline `onerror`, add `width="200" height="200"` to img
- [x] 3.4 [FE] Update `PersonCardReact.tsx` — import `AVATAR_FALLBACK` from `data/about/constants.ts`
- [x] 3.5 [FE] Update `about-images.ts` — import `AVATAR_FALLBACK` from `data/about/constants.ts`
- [x] 3.6 [FE] Update `DesktopNav.astro` — import `navItems` from `data/navigation.ts`, remove `is:global` from styles, use `:global()` only for `.open` class
- [x] 3.7 [FE] Update `MobileNav.astro` — import `navItems` from `data/navigation.ts`

## 4. Fix type safety

- [x] 4.1 [FE] Update `composition-root.server.ts` — replace `null as unknown` with properly typed null cast and explanatory comment

## 5. Fix ExpertsNetwork CSS

- [x] 5.1 [FE] Create `src/styles/experts-network.css` with styles extracted from `ExpertsNetwork.tsx`, using `var(--font-family-base)` for font-family
- [x] 5.2 [FE] Update `ExpertsNetwork.tsx` — remove inline `responsiveStyles` string and `<style>` injection
- [x] 5.3 [FE] Update `about.astro` — import `@/styles/experts-network.css`

## 6. Fix HTML/accessibility

- [x] 6.1 [FE] Update `OfficeHeader.astro` — replace `width="100%"` with CSS styling
- [x] 6.2 [FE] Update `methods.astro` — fix `aria-label` values to human-readable text

## 7. Verify

- [x] 7.1 [FE] Run `yarn astro check` and fix any TypeScript errors
- [x] 7.2 [FE] Run `yarn build` to verify the site builds successfully
