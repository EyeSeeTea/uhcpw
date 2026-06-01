## 1. Create Methods Data Module

- [x] 1.1 [BE] Create `src/data/methods/methods-data.ts` with `getMethodsPageData()` that fetches methods and generalContent via composition root, returns typed `MethodsPageData`
- [x] 1.2 [BE] Refactor `src/pages/methods.astro` to import and call `getMethodsPageData()` instead of using composition root directly. Remove direct imports of `composition-root.server` and `future-bridge`

## 2. ESLint Enforcement

- [x] 2.1 [BE] Add `no-restricted-imports` rule in `eslint.config.mjs` scoped to `src/pages/**/*.astro` that disallows importing from `@/infra/composition-root.server` and `@/infra/future-bridge`
- [x] 2.2 [BE] Verify lint passes on the refactored methods page and fails if the old pattern is reintroduced

## 3. Documentation

- [x] 3.1 [BE] Update `AGENTS.md` with a "Data Layer Convention" section: pattern description, example, and rationale
- [~] 3.2 [BE] ~~Add data layer convention rule to project-level CLAUDE.md~~ — removed; AGENTS.md is already picked up by Claude Code

## 5. Move About Page Image Downloads into Data Layer

- [x] 5.1 [BE] Expand `getAboutPageData()` in `src/data/about/about-data.ts` to also handle image downloads (call `getServerD2Api()` internally, run `downloadAboutPersonImages` and `downloadOfficeImage`), returning team/experts with resolved images and the office image result
- [x] 5.2 [BE] Refactor `src/pages/about.astro` to use the expanded return value — remove `getServerD2Api` import and the eslint-disable comment
- [x] 5.3 [BE] Verify lint passes with no eslint-disable exceptions for the data layer rule

## 6. Validation

- [x] 6.1 [BE] Run `yarn build`, `yarn lint`, and `yarn astro check` to confirm no regressions (build fails due to DHIS2 network timeout — not code-related; lint and astro check pass clean)
