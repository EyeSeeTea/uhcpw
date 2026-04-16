## ADDED Requirements

### Requirement: TreeSelector visual parity with SPA
The TreeSelector rendered inside the experts island SHALL be visually identical to the SPA rendering of the same component across desktop (>=960px), tablet (600–959px), and mobile (<600px) viewports for: the search input, the "Select all" / "Clear all" action buttons, the selected country chips, the placeholder (`N selected` / country-name) area, and the floating "Clear" button that appears when at least one country is selected.

Visual parity is verified by comparing computed CSS values and screenshots against the SPA reference.

#### Scenario: Search input height matches SPA
- **WHEN** the TreeSelector dropdown is open and the search input is rendered
- **THEN** the search input's computed outer height is 42px (matching the SPA: 20px inner height + 10px top padding + 10px bottom padding + 1px border top + 1px border bottom), and its border-radius is 20px, background is `#f2f9fd`, and border is `1px solid #cfe9f7`

#### Scenario: "Select all" button styling matches SPA
- **WHEN** the TreeSelector dropdown is open and the "Select all" button is visible
- **THEN** the button's computed `color` is `orange` (`rgb(255, 165, 0)`), `text-transform` is `none`, `font-weight` is `400`, and `padding` is `0`, and the rendered label text is "Select all" (not "SELECT ALL")

#### Scenario: "Clear all" button styling matches SPA
- **WHEN** the TreeSelector dropdown is open and at least one country is selected so the in-dropdown "Clear all" button is enabled
- **THEN** the button's computed `color` is `orange` (`rgb(255, 165, 0)`), `text-transform` is `none`, `font-weight` is `400`, and the rendered label text is "Clear" (not "CLEAR")

#### Scenario: Selected chips styling matches SPA
- **WHEN** at least one country is selected and rendered as a chip inside the TreeSelector input
- **THEN** each chip's computed `background-color` is `#cfe9f7` (`rgb(207, 233, 247)`), `border-radius` is `20px`, `border` is `none`, and `min-height` is `32px`

#### Scenario: Placeholder spacing matches SPA
- **WHEN** no countries are selected and the input shows the "(0 selected)" placeholder
- **THEN** the horizontal offset of the placeholder text from the input's left edge matches the SPA's computed value (pixel-for-pixel, tolerance ±1px)

#### Scenario: Floating "Clear" button position matches SPA
- **WHEN** at least one country is selected, triggering the floating "Clear" button outside the input
- **THEN** the button is positioned `absolute` with `top: -35px` and `right: -15px` relative to the selector container, has `color: orange` (`rgb(255, 165, 0)`), `text-transform: none`, `font-weight: 400`, and the rendered label is "Clear" (not "CLEAR")

#### Scenario: Parity holds across viewports
- **WHEN** the experts page is rendered at desktop (1280px), tablet (768px), and mobile (375px) widths
- **THEN** each of the above scenarios' computed values match their SPA counterparts at the same viewport

### Requirement: Shared TreeSelector component is not forked
The fix SHALL NOT introduce a forked copy of `TreeSelector`, `TreeSelectorList`, `SelectedChip`, or `SearchInput` inside `astro-app/`. The shared React SPA component under `src/webapp/components/tree-selector/` remains the single source of truth.

#### Scenario: No forked component files under astro-app
- **WHEN** the change is archived
- **THEN** no file matching `astro-app/src/**/TreeSelector*.{ts,tsx}`, `astro-app/src/**/TreeSelectorList*.{ts,tsx}`, `astro-app/src/**/SelectedChip*.{ts,tsx}`, or `astro-app/src/**/SearchInput*.{ts,tsx}` exists beyond the existing `ExpertsNetworkSelector.tsx` wrapper
