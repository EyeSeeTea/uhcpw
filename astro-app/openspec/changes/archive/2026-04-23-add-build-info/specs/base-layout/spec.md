## ADDED Requirements

### Requirement: Layout renders build info meta tag
The Layout SHALL render a single `<meta name="build-info" content="v{version} / {commit} / {buildDate}">` tag inside `<head>`, with values sourced from the build-info resolver at build time.

#### Scenario: Meta tag appears in head
- **WHEN** any page uses `<Layout>`
- **THEN** the rendered HTML `<head>` contains exactly one `<meta name="build-info" content="...">` tag with the current build's version, commit, and date
