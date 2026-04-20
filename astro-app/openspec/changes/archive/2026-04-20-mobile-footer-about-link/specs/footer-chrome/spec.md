## MODIFIED Requirements

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

## ADDED Requirements

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
