## ADDED Requirements

### Requirement: PersonCardReact avatar declares intrinsic dimensions and lazy-loads
The React variant of the person card (`PersonCardReact.tsx`), used inside the experts island on `/about`, SHALL declare `width={200}`, `height={200}`, `loading="lazy"`, and `decoding="async"` on its avatar `<img>`. This matches the Astro `PersonCard.astro` variant and prevents the dozens of avatars on the page from contributing to layout shift or competing for above-the-fold bandwidth.

#### Scenario: PersonCardReact avatar has intrinsic size
- **WHEN** an expert person card renders in the React island
- **THEN** the avatar `<img>` has `width="200"` and `height="200"` HTML attributes

#### Scenario: PersonCardReact avatars below the fold lazy-load
- **WHEN** the experts island renders dozens of person cards
- **THEN** avatar `<img>` elements outside the initial viewport have `loading="lazy"`
- **AND** the browser does not download those images until they approach the viewport
