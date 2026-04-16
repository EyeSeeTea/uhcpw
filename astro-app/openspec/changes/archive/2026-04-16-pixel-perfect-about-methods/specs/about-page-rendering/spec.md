## ADDED Requirements

### Requirement: Office image matches SPA dimensions
The office image in the OfficeHeader component MUST render at the same visual size as the SPA, scaling proportionally to fill its grid column width.

#### Scenario: Desktop viewport
- **WHEN** the /about page is rendered at desktop width (>959px)
- **THEN** the office image width fills its grid column and height scales proportionally (no fixed height attribute distorting aspect ratio)

### Requirement: Text column spacing matches SPA
The `.text-column` content MUST have the same spacing and positioning relative to the image column as the SPA's MUI Grid layout.

#### Scenario: Desktop viewport
- **WHEN** the /about page is rendered at desktop width (>959px)
- **THEN** the gap between the image column and text column visually matches the SPA (MUI Grid spacing={5} equivalent), and the text content has equivalent inner padding to MUI Container maxWidth="sm"
