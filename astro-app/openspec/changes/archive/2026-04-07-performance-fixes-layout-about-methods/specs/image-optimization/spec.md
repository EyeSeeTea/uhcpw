## ADDED Requirements

### Requirement: Layout chrome images use Astro's image pipeline
All raster images that are part of the layout chrome — specifically the WHO blue logo, the WHO white logo, the UHC home logo, and the EU flag — SHALL live in `src/assets/` and SHALL be rendered through Astro's `<Image />` component, not served as static files from `/public/images/`.

#### Scenario: Logos are not served from /public/images/
- **WHEN** the production build runs (`yarn build`)
- **THEN** the rendered HTML for any page contains no references to `/images/who-logo-blue.png`, `/images/who-logo-white.png`, `/images/uhcw-home-logo.png`, or `/images/europe-flag.png`
- **AND** these files are not present in `dist/images/` (or are present only as referenced by other components, not by `Header.astro`/`Footer.astro`)

#### Scenario: Layout chrome assets emit srcset
- **WHEN** the production build emits the header and footer
- **THEN** each layout-chrome `<img>` has a `srcset` attribute with multiple `webp` candidates sized for the responsive CSS breakpoints
