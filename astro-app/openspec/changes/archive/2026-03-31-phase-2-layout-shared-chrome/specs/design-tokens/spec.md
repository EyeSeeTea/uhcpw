## ADDED Requirements

### Requirement: Theme defines color tokens
The theme stylesheet SHALL define CSS custom properties for the SPA's color palette, including at minimum: accent primary (`#0089d6`), accent primary dark (`#004BA0`), dark blue (`#0360A7`), secondary/orange (`#fb8c00`), and grey scale values.

#### Scenario: Accent primary color available
- **WHEN** a component uses `var(--color-accent-primary)`
- **THEN** the computed value is `#0089d6`

#### Scenario: All color tokens defined
- **WHEN** the theme stylesheet is loaded
- **THEN** custom properties exist for primary, secondary, blue scale, grey scale, and status colors

### Requirement: Theme defines typography tokens
The theme stylesheet SHALL define CSS custom properties for the font family (`"Lato", Roboto, Helvetica, Arial, sans-serif`) and base font size.

#### Scenario: Font family token available
- **WHEN** a component uses `var(--font-family-base)`
- **THEN** the computed value starts with `"Lato"`

### Requirement: Theme defines breakpoint tokens
The theme stylesheet SHALL define CSS custom properties for responsive breakpoints: small screen (960px), mobile (600px).

#### Scenario: Breakpoint values available
- **WHEN** a component references `--breakpoint-small-screen`
- **THEN** the value is `960px`

### Requirement: Theme includes CSS resets
The theme stylesheet SHALL include minimal CSS resets (box-sizing: border-box, margin: 0 on body, consistent font rendering) so all pages start from a predictable baseline.

#### Scenario: Box-sizing reset applied
- **WHEN** the Layout renders
- **THEN** all elements use `box-sizing: border-box`

#### Scenario: Body has zero margin
- **WHEN** the Layout renders
- **THEN** the `<body>` element has zero margin and padding

### Requirement: Theme is framework-agnostic
The theme tokens SHALL be defined as plain CSS custom properties on `:root`, usable by Astro scoped styles, inline styles, and React island components without any framework-specific import.

#### Scenario: React island accesses theme token
- **WHEN** a React island component uses `var(--color-accent-primary)` in its CSS
- **THEN** the color resolves correctly because the token is defined on `:root`
