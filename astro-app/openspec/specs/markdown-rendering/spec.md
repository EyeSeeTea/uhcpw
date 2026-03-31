## ADDED Requirements

### Requirement: Convert markdown strings to HTML at build time

The system SHALL provide a utility function that converts markdown strings (from DHIS2 data values) to HTML at build time using the `marked` library. The output SHALL be rendered into Astro templates via the `set:html` directive.

#### Scenario: Markdown paragraph rendering

- **WHEN** a markdown string containing paragraphs is processed
- **THEN** the output contains `<p>` tags with the paragraph content

#### Scenario: Markdown list rendering

- **WHEN** a markdown string containing unordered lists is processed
- **THEN** the output contains `<ul>` and `<li>` tags

#### Scenario: Markdown link rendering

- **WHEN** a markdown string containing `[text](url)` links is processed
- **THEN** the output contains `<a href="url">text</a>` tags

### Requirement: Typography styling for rendered markdown

Rendered markdown HTML SHALL be styled to match the React SPA's typography: body text uses the application's body2 font size (0.875rem / 14px), lists have `1.2em` left padding, and links use the accent-primary color with no text decoration (underline on hover).

#### Scenario: Styled markdown output

- **WHEN** rendered markdown is displayed on the Methods page
- **THEN** paragraphs, lists, and links match the React SPA's visual styling

### Requirement: Reusable across pages

The markdown rendering utility SHALL be a standalone function importable by any Astro page or component — not coupled to the Methods page. Future pages (e.g., About) that also receive markdown from DHIS2 SHALL be able to use the same utility.

#### Scenario: Import from another page

- **WHEN** a new Astro page needs to render DHIS2 markdown content
- **THEN** it can import and call the same markdown utility function without modification
