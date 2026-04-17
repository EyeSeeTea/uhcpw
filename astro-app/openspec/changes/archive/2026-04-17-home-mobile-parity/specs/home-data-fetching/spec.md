## ADDED Requirements

### Requirement: Build a separate news slice for the mobile carousel
The build-time code SHALL derive a `news: ReadonlyArray<HomeResourceState>` slice in addition to `resources`. The slice contains items with `kind === "news"` and a truthy `favouriteSection`, sorted by `favouriteSectionOrder` ascending, capped at 6 entries.

#### Scenario: Only news items with favouriteSection are included
- **WHEN** an item has `kind === "news"` but `favouriteSection` is `false`
- **THEN** it does not appear in the `news` slice

#### Scenario: News slice is sorted independently of `resources`
- **WHEN** an item appears in both the `resources` (favouriteHome) and `news` (favouriteSection) selections
- **THEN** the `news` slice orders it by `favouriteSectionOrder`, regardless of its `favouriteHomeOrder`

#### Scenario: Hard limit of 6 news items
- **WHEN** more than 6 news items match the filter
- **THEN** only the 6 with the lowest `favouriteSectionOrder` are returned
