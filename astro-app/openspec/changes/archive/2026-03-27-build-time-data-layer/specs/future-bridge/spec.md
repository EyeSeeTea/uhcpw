## ADDED Requirements

### Requirement: Future-to-Promise bridge utility
The system SHALL provide a `runFuture<T>(future: FutureData<T>): Promise<T>` function in `astro-app/src/lib/future-bridge.ts` that converts a `FutureData<T>` into a standard `Promise<T>`.

#### Scenario: Successful future resolution
- **WHEN** `runFuture()` is called with a `FutureData<T>` that resolves successfully
- **THEN** the returned `Promise` SHALL resolve with the data value of type `T`

#### Scenario: Failed future resolution
- **WHEN** `runFuture()` is called with a `FutureData<T>` that rejects with an error
- **THEN** the returned `Promise` SHALL reject with the error string

#### Scenario: Usage in Astro frontmatter
- **WHEN** an `.astro` page uses `await runFuture(compositionRoot.method.get.execute())` in its frontmatter
- **THEN** the page SHALL have access to the resolved data for rendering in the template section
