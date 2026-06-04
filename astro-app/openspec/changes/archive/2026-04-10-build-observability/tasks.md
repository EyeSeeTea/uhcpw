## 1. Add dependencies

- [x] 1.1 [BE] Add `pino` as a production dependency and `pino-pretty` as a dev dependency

## 2. Create logger module

- [x] 2.1 [BE] Create `src/lib/logger.ts` with root logger, `createLogger(name)` factory, and `startTimer()` utility
- [x] 2.2 [BE] Configure log level via `LOG_LEVEL` env var (default: `info`), `pino-pretty` transport in non-production

## 3. Instrument infrastructure layer

- [x] 3.1 [BE] Instrument `src/infra/composition-root.server.ts` — log initialization with timing on first call
- [x] 3.2 [BE] Instrument `src/infra/future-bridge.ts` — add an optional `label` parameter to `runFuture`, log debug on start, info on completion with duration, error on failure
- [x] 3.3 [BE] Update all `runFuture` call sites (methods.astro, about.astro, 404.astro, about-data.ts) to pass descriptive labels

## 4. Instrument data layer

- [x] 4.1 [BE] Instrument `src/data/about/about-data.ts` `getAboutPageData()` — log aggregate call timing

## 5. Add build lifecycle hook

- [x] 5.1 [BE] Add inline Astro integration in `astro.config.mjs` with `astro:build:start` and `astro:build:done` hooks that log total build duration

## 6. Test configuration

- [x] 6.1 [BE] Set `LOG_LEVEL=silent` in the test script (`package.json`) to suppress log noise during tests

## 7. Verify

- [x] 7.1 [BE] Run `yarn build` and verify structured log output appears with timing data
- [x] 7.2 [BE] Run `yarn build` with `LOG_LEVEL=debug` and verify verbose output
- [x] 7.3 [BE] Run `yarn test` and verify no log noise
- [x] 7.4 [BE] Verify client bundle does not include pino (check `dist/` output or bundle analyzer)

## 8. Update specs

- [x] 8.1 [BE] Create `openspec/specs/build-logging/spec.md` documenting the logging capability
