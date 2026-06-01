## ADDED Requirements

### Requirement: Header logos are served through Astro's image pipeline
The WHO logo and the UHC home logo in `Header.astro` SHALL be sourced from `src/assets/` and rendered with the Astro `<Image />` component, not as raw `<img src="/images/...png">` from the public directory. The generated `<img>` SHALL include explicit `width` and `height` attributes matching the rendered display size, and SHALL emit a `srcset` covering the responsive widths declared by the existing CSS breakpoints.

#### Scenario: WHO logo is optimized
- **WHEN** the Header renders the WHO logo
- **THEN** the rendered HTML contains an `<img>` whose `src`/`srcset` points to a hashed asset under `/_astro/` (not `/images/who-logo-blue.png`)
- **AND** the `<img>` has explicit `width` and `height` attributes
- **AND** the served format is `webp` (or `avif`) on browsers that accept it

#### Scenario: UHC logo is optimized
- **WHEN** the Header renders the UHC home logo
- **THEN** the rendered HTML contains an optimized `<img>` from the Astro image pipeline
- **AND** the served bytes for a 180×72 display size are an order of magnitude smaller than the original PNG

### Requirement: Header WHO logo is marked as a high-priority resource
Because the WHO logo is the LCP candidate on most pages, the `<Image />` for the header WHO logo SHALL declare `loading="eager"` and `fetchpriority="high"` so the browser fetches it before deferred scripts.

#### Scenario: WHO logo has high fetch priority
- **WHEN** the Header renders
- **THEN** the WHO logo `<img>` element has `fetchpriority="high"` and is not lazy-loaded
