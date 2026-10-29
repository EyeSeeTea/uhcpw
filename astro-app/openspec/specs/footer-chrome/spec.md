## Purpose

Defines the behavior and appearance of the shared site footer: the WHO disclaimer, co-funding acknowledgment, about/contact sections, copyright bar, mobile layout, and image handling.
## Requirements
### Requirement: Footer displays WHO disclaimer section
The Footer SHALL display the WHO logo and a disclaimer/description text about the UHC Data Portal. The disclaimer text SHALL be sourced from `GeneralContent.footer.disclaimer` fetched at build time, not hardcoded.

#### Scenario: WHO section renders with dynamic disclaimer
- **WHEN** the Footer renders on a desktop viewport
- **THEN** the WHO logo is visible
- **AND** the disclaimer text matches the `GeneralContent.footer.disclaimer` value

#### Scenario: Disclaimer falls back to empty when GeneralContent is unavailable
- **WHEN** the Footer renders and `GeneralContent` is not provided
- **THEN** the disclaimer section renders with no text (graceful degradation)

### Requirement: Footer displays co-funding section
The Footer SHALL display the EU flag image and co-funding acknowledgment text.

#### Scenario: Co-funding section renders
- **WHEN** the Footer renders
- **THEN** the EU flag and co-funding text are visible

### Requirement: Footer displays about and contact sections
The Footer SHALL display an "About Us" section with a link to the About page and a "Contact Us" section with the office address, phone number, and email.

#### Scenario: About link navigates to about page
- **WHEN** the Footer renders
- **THEN** an "About Us" link pointing to `/about` is visible

#### Scenario: Contact info renders
- **WHEN** the Footer renders
- **THEN** the office address, phone number, and email are visible

### Requirement: Footer displays copyright bar
The Footer SHALL display a bottom bar with the copyright notice and a link to the WHO privacy policy. The privacy policy URL SHALL be sourced from `GeneralContent.cookies.policyUrl` fetched at build time.

#### Scenario: Copyright bar renders with dynamic policy link
- **WHEN** the Footer renders
- **THEN** the copyright text is visible at the bottom
- **AND** the privacy policy link href matches the `GeneralContent.cookies.policyUrl` value

#### Scenario: Privacy policy link uses fallback when URL unavailable
- **WHEN** `GeneralContent.cookies.policyUrl` is empty or undefined
- **THEN** the privacy policy link points to a reasonable default (e.g., `https://www.who.int/about/policies/privacy`)

### Requirement: Mobile footer reference links
The mobile footer SHALL link to the Astro Abbreviations and Glossary pages under the configured base path.

#### Scenario: Reference links navigate to Astro pages
- **WHEN** a user opens the mobile reference links
- **THEN** each link opens its corresponding Astro page in the current tab

### Requirement: Footer adapts to mobile layout
On viewports at or below the small-screen breakpoint (960px), the Footer SHALL reorganize its sections into a vertical layout. The "About us" section SHALL be rendered as a direct link to `/about` (not an accordion), styled consistently with the remaining accordion rows (same background, border-radius, and height). The "Abbreviations & glossary", "WHO privacy policy & disclaimer", and "Contact our office" sections SHALL remain collapsible `<details>`/`<summary>` accordion items. The About-us link and accordion summary rows SHALL each render at a minimum height of 56px, and the vertical gap between adjacent rows SHALL be 8px (not the accumulated margin+gap+margin that would otherwise stack). Accordion expand/collapse SHALL animate its content height instead of snapping open.

#### Scenario: Mobile footer shows About us as a direct link
- **WHEN** the viewport is 960px or narrower
- **THEN** the "About us" entry in the footer is a single `<a>` element whose `href` is `/about`
- **AND** the entry has no `<details>` wrapper and no expand affordance

#### Scenario: Mobile footer shows remaining sections as accordions
- **WHEN** the viewport is 960px or narrower
- **THEN** "Abbreviations & glossary", "WHO privacy policy & disclaimer", and "Contact our office" are each rendered as collapsible `<details>` elements
- **AND** activating a `<summary>` expands its corresponding section

#### Scenario: About us link is visually consistent with accordion rows
- **WHEN** the viewport is 960px or narrower
- **THEN** the About-us link's computed background matches the accordion row background
- **AND** the link's min-height, border-radius, and horizontal padding match the accordion summary rows so the footer column reads as a single visual stack

#### Scenario: Mobile rows are sized and spaced to match the SPA
- **WHEN** the viewport is 960px or narrower
- **THEN** the About-us link and each accordion summary have a rendered min-height of 56px
- **AND** the vertical distance between adjacent rows is 8px (no stacked margin + row-gap + margin)

#### Scenario: Accordion expand animates smoothly
- **WHEN** the user activates an accordion `<summary>` on a browser that supports `::details-content` and `interpolate-size: allow-keywords`
- **THEN** the revealed content height transitions from 0 to its natural height over a short duration (≈250ms)
- **AND** collapse reverses the same transition

### Requirement: Footer is responsive
The Footer SHALL render without horizontal overflow at all supported breakpoints.

#### Scenario: Desktop grid layout
- **WHEN** the viewport is wider than 960px
- **THEN** the footer content is arranged in a multi-column grid layout

#### Scenario: No overflow at mobile width
- **WHEN** the viewport is below 600px
- **THEN** the footer content fits without horizontal scrollbar

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

### Requirement: Footer bottom bar alignment
On all viewports, the copyright/privacy bar at the bottom of the Footer SHALL be left-aligned, using a consistent inline-start padding across breakpoints, so that the copyright text begins at the same horizontal offset on mobile as on desktop.

#### Scenario: Copyright text is left-aligned on mobile
- **WHEN** the viewport is 960px or narrower
- **THEN** the copyright notice in the footer bottom bar starts at a fixed inline-start padding (3.75rem)
- **AND** it is not center-aligned

#### Scenario: Privacy link hidden on mobile bottom bar
- **WHEN** the viewport is 960px or narrower
- **THEN** the privacy policy link inside the footer bottom bar is not rendered (it remains accessible via the mobile "WHO privacy policy & disclaimer" accordion)

### Requirement: Footer grid does not double horizontal padding
The inner `.footer-grid` container SHALL NOT add its own horizontal padding on top of the outer `.footer-top`'s `padding-inline: 32px`. The 32px from `.footer-top` SHALL be the single source of the footer's horizontal inset at every breakpoint.

#### Scenario: Mobile footer horizontal inset matches declared padding
- **WHEN** the viewport is 960px or narrower
- **THEN** the left edge of the first rendered child inside `.footer-top` sits exactly 32px from the left edge of `.footer-top`

#### Scenario: Desktop footer horizontal inset matches declared padding
- **WHEN** the viewport is wider than 960px
- **THEN** the left edge of the footer grid content sits exactly 32px from the left edge of `.footer-top` (no additional 24px inner padding)

