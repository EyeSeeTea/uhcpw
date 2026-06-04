## ADDED Requirements

### Requirement: Title banner height matches SPA
The `.title-banner` MUST render at the same height as the SPA's TitleContainer.

#### Scenario: Desktop viewport
- **WHEN** the /methods page is rendered at desktop width
- **THEN** the title banner height matches the SPA, achieved by using the same line-height (1.167) on the heading text as MUI Typography variant="h3"
