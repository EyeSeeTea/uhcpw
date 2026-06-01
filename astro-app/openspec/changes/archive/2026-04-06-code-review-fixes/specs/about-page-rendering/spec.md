## MODIFIED Requirements

### Requirement: OfficeHeader uses valid HTML img attributes
The OfficeHeader.astro component SHALL use CSS for image width instead of the invalid HTML `width="100%"` attribute.

#### Scenario: Image uses CSS width
- **WHEN** the office header image renders
- **THEN** it uses `style="width: 100%"` or a CSS class instead of the `width` HTML attribute

### Requirement: Aria labels use human-readable text
Components SHALL use human-readable text for `aria-label` attributes, not kebab-case identifiers.

#### Scenario: Methods page aria labels
- **WHEN** the methods page renders sections with aria-label
- **THEN** labels read as natural language (e.g., "Methods page header" not "methods-page-header")
