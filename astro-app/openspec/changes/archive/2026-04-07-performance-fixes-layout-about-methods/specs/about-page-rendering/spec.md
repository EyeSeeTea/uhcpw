## ADDED Requirements

### Requirement: Office header image is eagerly loaded with high fetch priority
The office image rendered by `OfficeHeader.astro` is the about page's hero element and SHALL be marked as a high-priority above-the-fold resource. The `<img>` SHALL declare `loading="eager"`, `fetchpriority="high"`, and `decoding="async"`. It SHALL NOT use `loading="lazy"`. It SHALL also declare intrinsic `width` and `height` attributes that match the actual dimensions of the build-time-optimized webp file, so the layout reserves the box before the bytes arrive.

#### Scenario: Office image is not lazy-loaded
- **WHEN** the `/about` page renders
- **THEN** the office image `<img>` does not have `loading="lazy"`
- **AND** it has `loading="eager"` and `fetchpriority="high"`

#### Scenario: Office image declares intrinsic dimensions
- **WHEN** the `/about` page renders
- **THEN** the office image `<img>` has numeric `width` and `height` attributes
- **AND** the `width:height` ratio matches the underlying webp file's dimensions

#### Scenario: Office image is the LCP candidate
- **WHEN** Chrome DevTools measures the LCP element on `/about` against the production build
- **THEN** the LCP element is the office image, not the header WHO logo

### Requirement: downloadOfficeImage returns intrinsic dimensions
`downloadOfficeImage` in `src/data/about/about-images.ts` SHALL return `{ src, width, height }` (not just a string), where `width` and `height` are read from the resized webp file's metadata via `sharp`. `about.astro` SHALL pass these dimensions through to `OfficeHeader.astro`.

#### Scenario: downloadOfficeImage returns dimensions
- **WHEN** `downloadOfficeImage` finishes processing a remote DHIS2 image
- **THEN** the returned object has `src`, `width`, and `height` fields
- **AND** `width` is 770 (the configured `OFFICE_IMAGE_OPTIONS.width`) or less
- **AND** `height` reflects the resized image's actual height
