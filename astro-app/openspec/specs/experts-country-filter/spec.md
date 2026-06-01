## ADDED Requirements

### Requirement: Experts section displays title and subtitle
The experts section SHALL display a title (from `generalContent.aboutUs.title` or fallback "The Financial Protection Expert Network") and a subtitle (from `generalContent.aboutUs.subtitle` or fallback text). The subtitle has `max-width: 50%` on desktop, `100%` on mobile.

#### Scenario: Title and subtitle with custom content
- **WHEN** generalContent provides a custom title and subtitle
- **THEN** those custom strings are displayed

#### Scenario: Title and subtitle fallback
- **WHEN** generalContent is unavailable or fields are empty
- **THEN** the default "The Financial Protection Expert Network" title and default subtitle are displayed

### Requirement: TreeSelector filters experts by country
The experts section SHALL include a TreeSelector component that allows users to select one or more countries. The expert list filters to show only experts whose `countryId` matches a selected country. When no countries are selected, all experts are shown.

#### Scenario: No filter applied shows all experts
- **WHEN** no countries are selected in the TreeSelector
- **THEN** all experts are displayed

#### Scenario: Single country filter
- **WHEN** the user selects "Spain" in the TreeSelector
- **THEN** only experts with `countryId` matching Spain's ID are displayed

#### Scenario: Multiple country filter
- **WHEN** the user selects "Spain" and "France"
- **THEN** experts from both countries are displayed, maintaining sort order

#### Scenario: Clear filter restores all experts
- **WHEN** the user clicks "Clear" in the TreeSelector
- **THEN** all experts are displayed again

### Requirement: TreeSelector configuration matches SPA
The TreeSelector SHALL be configured with: `hasSelectAll`, `hasClearAll`, `topClearAll={-35}`, `showParentIfChecked={true}`, `showOnlyAllParentSelectedIfChecked={true}`, `allSelectedLabel="All countries/areas"`, and the pre-computed `parentSort`.

#### Scenario: TreeSelector props match SPA
- **WHEN** the TreeSelector renders
- **THEN** it has select-all capability, clear-all capability, shows parent names when all children are checked, and uses the "All countries/areas" label

### Requirement: Expert cards in responsive grid
Filtered experts SHALL be displayed in a responsive grid: auto-fill columns on desktop (md breakpoint and above), 2-column grid on mobile (xs=6, sm=6).

#### Scenario: Desktop grid layout
- **WHEN** viewport is >= 960px
- **THEN** expert cards fill available columns automatically

#### Scenario: Mobile grid layout
- **WHEN** viewport is < 960px
- **THEN** expert cards are arranged in a 2-column grid

### Requirement: Island receives all data as serialized props
The experts island SHALL receive `experts`, `countryOptions`, `parentSortOrder`, `title`, and `subtitle` as serialized props from the Astro frontmatter. It SHALL NOT depend on any React context from the SPA.

#### Scenario: Island is context-independent
- **WHEN** the experts island renders
- **THEN** it does not call `useAppContext()` or any SPA-specific context provider

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
