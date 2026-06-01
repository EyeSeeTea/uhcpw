## MODIFIED Requirements

### Requirement: Footer displays WHO disclaimer section
The Footer SHALL display the WHO logo and a disclaimer/description text about the UHC Data Portal. The disclaimer text SHALL be sourced from `GeneralContent.footer.disclaimer` fetched at build time, not hardcoded.

#### Scenario: WHO section renders with dynamic disclaimer
- **WHEN** the Footer renders on a desktop viewport
- **THEN** the WHO logo is visible
- **AND** the disclaimer text matches the `GeneralContent.footer.disclaimer` value

#### Scenario: Disclaimer falls back to empty when GeneralContent is unavailable
- **WHEN** the Footer renders and `GeneralContent` is not provided
- **THEN** the disclaimer section renders with no text (graceful degradation)

### Requirement: Footer displays copyright bar
The Footer SHALL display a bottom bar with the copyright notice and a link to the WHO privacy policy. The privacy policy URL SHALL be sourced from `GeneralContent.cookies.policyUrl` fetched at build time.

#### Scenario: Copyright bar renders with dynamic policy link
- **WHEN** the Footer renders
- **THEN** the copyright text is visible at the bottom
- **AND** the privacy policy link href matches the `GeneralContent.cookies.policyUrl` value

#### Scenario: Privacy policy link uses fallback when URL unavailable
- **WHEN** `GeneralContent.cookies.policyUrl` is empty or undefined
- **THEN** the privacy policy link points to a reasonable default (e.g., `https://www.who.int/about/policies/privacy`)
