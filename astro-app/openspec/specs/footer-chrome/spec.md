## ADDED Requirements

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

### Requirement: Footer adapts to mobile layout
On viewports at or below the small-screen breakpoint (960px), the Footer SHALL reorganize its sections into a vertical accordion layout using `<details>`/`<summary>` elements, so content is collapsed by default and expandable.

#### Scenario: Mobile footer shows accordion sections
- **WHEN** the viewport is 960px or narrower
- **THEN** footer sections are rendered as collapsible accordion items

#### Scenario: Accordion section expands on click
- **WHEN** the user activates an accordion summary on the mobile footer
- **THEN** the corresponding section content expands and becomes visible

### Requirement: Footer is responsive
The Footer SHALL render without horizontal overflow at all supported breakpoints.

#### Scenario: Desktop grid layout
- **WHEN** the viewport is wider than 960px
- **THEN** the footer content is arranged in a multi-column grid layout

#### Scenario: No overflow at mobile width
- **WHEN** the viewport is below 600px
- **THEN** the footer content fits without horizontal scrollbar
## Requirements
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

