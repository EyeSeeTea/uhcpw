## ADDED Requirements

### Requirement: Mobile layout is a CSS media query switch
The page SHALL use CSS media queries (not separate routes and not JS viewport detection) to toggle between the desktop and mobile layouts. At viewport >= 960px, the desktop sections wrapper is visible and the mobile card grid is `display: none`. At viewport < 960px, the mobile card grid is `display: block` and the desktop sections wrapper is `display: none`.

#### Scenario: Breakpoint swap at 960px
- **WHEN** the viewport width crosses 960px
- **THEN** the layout swaps between the desktop section stack and the mobile card grid without any JavaScript

### Requirement: Mobile card grid renders six navigation boxes
The mobile card grid SHALL render six colored boxes in a 2-column CSS grid: two "big" boxes (Indicator Explorer on orange `#fe8c4f` with the indicator icon; Policy Explorer on blue `#0089d6` with the policy icon), and four "small" boxes (Regional overview on dark blue `#0360a6`; Countries & areas on green `#4fad56`; Methods on green `#4fad56`; Resources on dark blue `#0360a6`). Each box is wrapped in an `<a>` linking to its corresponding `buttonLink` from `homePageContent`.

#### Scenario: Big boxes include description text
- **WHEN** a big box renders
- **THEN** it shows the section title, the section icon, and a short description paragraph

#### Scenario: Small boxes show title only
- **WHEN** a small box renders
- **THEN** it shows only the section title, centered

### Requirement: Mobile card grid visual treatment
Each box SHALL be styled with `border-radius: 21px`, white text, and a bubble pattern white PNG positioned as an absolute decorative image at the top-right of the box. Small boxes center their content; big boxes align content to the left and offset the bubble pattern further right. Title font size responds to the viewport (20px → 16px at 575px → 14px at 360px).

#### Scenario: Box styling at default mobile width
- **WHEN** the mobile card grid renders at viewport between 576px and 959px
- **THEN** each box has `border-radius: 21px`, a decorative bubble pattern image at the top-right, and title text at 20px

#### Scenario: Title scales down on narrow phones
- **WHEN** the viewport is < 360px
- **THEN** box titles render at 14px

### Requirement: Map island resizes on mobile
The map island SHALL honor the responsive CSS on its containing `.map-section`: `height: 50vh` at < 960px, with `min-height` reducing to 600px at 550px and 550px at 500px.

#### Scenario: Map shrinks at mobile breakpoint
- **WHEN** the viewport is < 960px
- **THEN** `.map-section` is `height: 50vh`

#### Scenario: Map min-height reduces on narrower screens
- **WHEN** the viewport is < 500px
- **THEN** `.map-section` has `min-height: 550px`

### Requirement: Mobile scope limited to static navigation and shorter map
The mobile layout SHALL NOT include the SPA's mobile carousels (`ResourcesCarousel`, news carousel) or the `regionalPageMobilePopUp` dialog. The mobile card grid plus the shorter map provides primary mobile navigation; carousel and popup parity are explicit non-goals for this change.

#### Scenario: Regional overview link behavior on mobile
- **WHEN** a user taps the "Regional overview" card
- **THEN** the browser navigates directly to `homePageContent.analysis.regional.buttonLink` without opening the SPA's regional popup
