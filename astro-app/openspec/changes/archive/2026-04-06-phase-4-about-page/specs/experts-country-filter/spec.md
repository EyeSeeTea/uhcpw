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
