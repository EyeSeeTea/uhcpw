## ADDED Requirements

### Requirement: Single normalizeUrl utility
The system SHALL provide a single `normalizeUrl` function in `lib/url.ts` that removes duplicate slashes from URL paths while preserving protocol slashes (`://`).

#### Scenario: Normalize URL with double slashes
- **WHEN** a URL like `https://example.com//api//path` is passed to `normalizeUrl`
- **THEN** it returns `https://example.com/api/path`

#### Scenario: Preserve protocol slashes
- **WHEN** a URL like `https://example.com/path` is passed
- **THEN** it returns the URL unchanged

#### Scenario: Handle null/undefined input
- **WHEN** `null` or `undefined` is passed
- **THEN** it returns `undefined`

### Requirement: Shared AVATAR_FALLBACK constant
The system SHALL export a single `AVATAR_FALLBACK` constant from `data/about/constants.ts`, used by all components that need the avatar placeholder path.

#### Scenario: Consistent fallback across components
- **WHEN** any component needs the avatar fallback image path
- **THEN** it imports `AVATAR_FALLBACK` from `data/about/constants.ts` instead of defining its own

### Requirement: Shared navigation data
The system SHALL export navigation items from `data/navigation.ts` with the `NavItem` type, used by both desktop and mobile navigation components.

#### Scenario: Desktop and mobile nav use same source
- **WHEN** DesktopNav or MobileNav renders navigation links
- **THEN** both use items imported from `data/navigation.ts`
