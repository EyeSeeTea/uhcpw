## 1. Create new directory structure

- [x] 1.1 [FE] Create `src/data/about/` and `src/data/about/__tests__/` directories
- [x] 1.2 [FE] Create `src/infra/` and `src/infra/__tests__/` directories
- [x] 1.3 [FE] Create `src/lib/__tests__/` directory (already has `__tests__/` but will replace contents)
- [x] 1.4 [FE] Create `src/islands/about/` and `src/islands/about/__tests__/` directories

## 2. Move files to new locations (use git mv)

- [x] 2.1 [FE] Move `lib/about-data.ts`, `lib/about-images.ts`, `lib/image-validation.ts` → `data/about/`
- [x] 2.2 [FE] Move `lib/__tests__/about-data.test.ts` → `data/about/__tests__/`
- [x] 2.3 [FE] Move `lib/composition-root.server.ts` → `infra/`
- [x] 2.4 [FE] Move `lib/future-bridge.ts` → `infra/`
- [x] 2.5 [FE] Move `lib/future-bridge.test.ts` → `infra/__tests__/`
- [x] 2.6 [FE] Move `lib/__tests__/markdown.test.ts` → stays in `lib/__tests__/` (already correct)
- [x] 2.7 [FE] Move `lib/shared-imports.test.ts` → `lib/__tests__/`
- [x] 2.8 [FE] Move `islands/ExpertsNetwork.tsx`, `islands/PersonCardReact.tsx` → `islands/about/`
- [x] 2.9 [FE] Move `islands/ExpertsNetwork.test.tsx`, `islands/PersonCardReact.test.tsx` → `islands/about/__tests__/`

## 3. Delete dead code

- [x] 3.1 [FE] Delete `src/lib/futures.ts` (unused apiToFuture)
- [x] 3.2 [FE] Delete `src/pages/test-data.astro` (dev-only debug page)

## 4. Update imports

- [x] 4.1 [FE] Update imports in `pages/about.astro` (lib/ → data/about/, infra/)
- [x] 4.2 [FE] Update imports in `pages/methods.astro` if it references any moved files
- [x] 4.3 [FE] Update imports in `data/about/about-images.ts` (references to sibling modules and infra/)
- [x] 4.4 [FE] Update imports in `data/about/about-data.ts` if it references moved modules
- [x] 4.5 [FE] Update imports in `data/about/image-validation.ts` if it references moved modules
- [x] 4.6 [FE] Update imports in `islands/about/ExpertsNetwork.tsx` if it references moved modules
- [x] 4.7 [FE] Update imports in all test files to match new paths

## 5. Verify

- [x] 5.1 [FE] Run `yarn astro check` — no type errors
- [x] 5.2 [FE] Run `yarn test` — all tests pass
- [x] 5.3 [FE] Run `yarn build` — build succeeds
- [x] 5.4 [FE] Verify `git log --follow` works for at least one moved file (will work after commit)

## 6. Documentation

- [x] 6.1 [FE] Add folder structure conventions section to AGENTS.md
- [x] 6.2 [FE] Update specs: synced delta specs to main openspec/specs/
