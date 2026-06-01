## MODIFIED Requirements

### Requirement: Header displays top bar with office title and reference links
The Header SHALL display a gradient top bar containing the office title "WHO Barcelona Office for Health Systems Financing" (white text, 16px) on the left and "Abbreviations" and "Glossary" links (black text) on the right. The Abbreviations and Glossary link URLs SHALL be sourced from `GeneralContent` fetched at build time, not hardcoded. If a URL is not available, the corresponding link SHALL not be rendered.

#### Scenario: Top bar renders with title and links
- **WHEN** the Header renders on a desktop viewport
- **THEN** the office title is visible in white text on the left
- **AND** Abbreviations and Glossary links are visible in black text on the right

#### Scenario: Top bar on mobile hides reference links
- **WHEN** the viewport is 960px or narrower
- **THEN** the office title is centered in white text
- **AND** the Abbreviations and Glossary links are hidden

#### Scenario: Reference links use dynamic URLs from GeneralContent
- **WHEN** the Header renders and `GeneralContent` provides abbreviation and glossary URLs
- **THEN** the Abbreviations link href matches the `GeneralContent.abbreviations.url` value
- **AND** the Glossary link href matches the `GeneralContent.glossary.url` value

#### Scenario: Reference link hidden when URL is unavailable
- **WHEN** `GeneralContent.abbreviations.url` is null or undefined
- **THEN** the Abbreviations link is not rendered

### Requirement: Header hides UHC home logo on home page desktop
The Header SHALL hide the UHC Data Portal logo (`uhcw-home-logo.png`) on desktop viewports when the current page is the home page (`/`). On mobile viewports or on non-home pages, the logo SHALL be visible. This matches the React SPA behavior.

#### Scenario: UHC logo hidden on desktop home page
- **WHEN** the current page is `/` and the viewport is wider than 960px
- **THEN** the UHC Data Portal logo is not visible

#### Scenario: UHC logo visible on desktop non-home page
- **WHEN** the current page is `/about` and the viewport is wider than 960px
- **THEN** the UHC Data Portal logo is visible

#### Scenario: UHC logo visible on mobile home page
- **WHEN** the current page is `/` and the viewport is 960px or narrower
- **THEN** the UHC Data Portal logo is visible
