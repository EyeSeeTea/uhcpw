## ADDED Requirements

### Requirement: Person card displays circular image with person details
A person card SHALL display a circular image, the person's first name and last name (bold), position (rendered from markdown/text), optional institution, and country name. All text is centered.

#### Scenario: Full person card rendering
- **WHEN** a person card renders with all fields populated
- **THEN** it displays: circular image, bold first + last name, position text, institution text, and country name — all center-aligned

#### Scenario: Missing institution
- **WHEN** a person has no `institution` field
- **THEN** the institution line is omitted; other fields render normally

### Requirement: Image sizing varies by context
Team person cards SHALL use 200px diameter images. Expert person cards SHALL use 200px on desktop and 150px on mobile (viewport < 600px).

#### Scenario: Team card image size
- **WHEN** a team person card renders
- **THEN** the image is 200x200px with `border-radius: 50%`

#### Scenario: Expert card responsive image size
- **WHEN** an expert person card renders on a viewport >= 600px
- **THEN** the image is 200x200px
- **WHEN** an expert person card renders on a viewport < 600px
- **THEN** the image is 150x150px

### Requirement: Name layout differs for team vs experts
Team person cards SHALL display first name and last name stacked vertically (column). Expert person cards SHALL display first name and last name side by side (row).

#### Scenario: Team name layout
- **WHEN** a team person card renders
- **THEN** first name appears above last name (flex-direction: column)

#### Scenario: Expert name layout
- **WHEN** an expert person card renders
- **THEN** first name appears to the left of last name (flex-direction: row)

### Requirement: Position text handles escaped newlines
The position field from DHIS2 may contain `\n` escape sequences. The card SHALL replace `\n` with actual line breaks when rendering.

#### Scenario: Escaped newlines in position
- **WHEN** a person's position is `"Senior\nResearcher"`
- **THEN** the rendered output shows "Senior" and "Researcher" on separate lines

### Requirement: Image styling matches SPA
Images SHALL use `object-fit: cover` and `object-position: 50% 0%` to crop from the top (better framing for face photos).

#### Scenario: Image crop behavior
- **WHEN** a person image renders
- **THEN** the `<img>` element has `object-fit: cover` and `object-position: 50% 0%`

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
## Requirements
### Requirement: PersonCardReact avatar declares intrinsic dimensions and lazy-loads
The React variant of the person card (`PersonCardReact.tsx`), used inside the experts island on `/about`, SHALL declare `width={200}`, `height={200}`, `loading="lazy"`, and `decoding="async"` on its avatar `<img>`. This matches the Astro `PersonCard.astro` variant and prevents the dozens of avatars on the page from contributing to layout shift or competing for above-the-fold bandwidth.

#### Scenario: PersonCardReact avatar has intrinsic size
- **WHEN** an expert person card renders in the React island
- **THEN** the avatar `<img>` has `width="200"` and `height="200"` HTML attributes

#### Scenario: PersonCardReact avatars below the fold lazy-load
- **WHEN** the experts island renders dozens of person cards
- **THEN** avatar `<img>` elements outside the initial viewport have `loading="lazy"`
- **AND** the browser does not download those images until they approach the viewport

