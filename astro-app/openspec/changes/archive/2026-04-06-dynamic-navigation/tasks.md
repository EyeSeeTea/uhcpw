## 1. Data Layer — Navigation Fetching

- [x] 1.1 [BE] Rewrite `src/data/navigation.ts` to export async `getNavItems()` that fetches countries and regions from DHIS2 via `getServerCompositionRoot()` and `runFuture()`, applying filtering (isInCountryPage, isInRegionalPage), sorting (alphabetical with Kosovo last for countries; fixed order for regions), label formatting (`"name (code)"` for regions), and slug-based href generation (`/countries/<slug>`, `/regional-overview/<slug>`)
- [x] 1.2 [BE] Implement slug generation matching existing Astro URL scheme: lowercase + hyphenate for countries, lowercase code for regions, with special cases for BIH sub-regions (`bih-federation`, `bih-republika-srpska`), Moldova (`moldova`), and Kosovo (`kosovo`)
- [x] 1.3 [BE] Keep `NavItem` type export unchanged and static nav items (Indicator explorer, Policy explorer, Methods, Resources, About us) hardcoded

## 2. Component Wiring — Props Threading

- [x] 2.1 [FE] Update the base layout to call `getNavItems()` in frontmatter and pass the result as a prop to DesktopNav and MobileNav
- [x] 2.2 [FE] Update DesktopNav.astro to accept `navItems` as a prop instead of importing the static array
- [x] 2.3 [FE] Update MobileNav.astro to accept `navItems` as a prop instead of importing the static array

## 3. Testing

- [x] 3.1 [BE] Add unit tests for `getNavItems()`: verify filtering, sorting, label format, and slug generation (especially special cases)

## 4. Verification & Spec Update

- [x] 4.1 [BE] Run `yarn build` and `yarn astro check` to confirm build succeeds with DHIS2 data
- [x] 4.2 [CR] Visually verify navigation dropdowns match the SPA's menus
- [x] 4.3 [CR] Update `openspec/specs/header-chrome/spec.md` with the modified dropdown requirement (hardcoded → dynamic)
