## MODIFIED Requirements

### Requirement: Person card accessibility
The PersonCard.astro component SHALL use valid HTML attributes and proper accessibility patterns.

#### Scenario: Image dimensions specified
- **WHEN** a person card renders a lazy-loaded image
- **THEN** the `<img>` element includes `width="200"` and `height="200"` HTML attributes to prevent layout shift

#### Scenario: No inline event handlers
- **WHEN** a person card renders an image
- **THEN** it does NOT use an inline `onerror` attribute (build-time fallback in about-images.ts is sufficient)

#### Scenario: Fallback constant imported
- **WHEN** PersonCard needs the avatar fallback path
- **THEN** it imports `AVATAR_FALLBACK` from `data/about/constants.ts`
