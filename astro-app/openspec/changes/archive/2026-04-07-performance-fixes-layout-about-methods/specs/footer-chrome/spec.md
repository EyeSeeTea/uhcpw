## ADDED Requirements

### Requirement: Footer logos are served through Astro's image pipeline
The WHO logo and the EU flag in `Footer.astro` SHALL be sourced from `src/assets/` and rendered via Astro's `<Image />` component. The generated `<img>` SHALL include explicit `width` and `height` attributes matching the rendered display size, and SHALL emit a `srcset` covering the desktop and mobile breakpoints already declared in the footer CSS.

#### Scenario: Footer WHO logo is optimized
- **WHEN** the Footer renders on any page
- **THEN** the WHO logo `<img>` `src`/`srcset` points to a hashed asset under `/_astro/` (not `/images/who-logo-white.png`)
- **AND** the `<img>` has explicit `width` and `height` attributes

#### Scenario: EU flag is optimized
- **WHEN** the Footer renders on any page
- **THEN** the EU flag `<img>` is served through the Astro image pipeline

### Requirement: Footer does not duplicate image elements across desktop and mobile variants
The Footer SHALL NOT render two separate `<img>` elements (one for desktop, one for mobile) for the same source image. The desktop and mobile layouts MAY use distinct container markup, but the WHO logo and the EU flag SHALL each appear as exactly one `<img>` element in the rendered DOM, with CSS controlling its position across breakpoints.

#### Scenario: Single WHO logo element in DOM
- **WHEN** the Footer renders on any viewport
- **THEN** `document.querySelectorAll('footer img[alt*="WHO" i]').length === 1`

#### Scenario: Single EU flag element in DOM
- **WHEN** the Footer renders on any viewport
- **THEN** `document.querySelectorAll('footer img[alt*="European Union" i]').length === 1`

#### Scenario: No hidden duplicate images downloaded
- **WHEN** the Footer renders
- **THEN** there is no `<img>` element in the footer with a rendered box of `0×0` pixels
