## MODIFIED Requirements

### Requirement: Centralized URL resolution for abbreviations and glossary
The methods page SHALL use a shared data-layer function for resolving abbreviations and glossary URLs (including fallbacks and normalization), instead of computing them inline.

#### Scenario: Methods page uses centralized URL resolution
- **WHEN** methods.astro needs abbreviations and glossary URLs
- **THEN** it calls `resolveGeneralContentUrls(generalContent)` from the data layer

#### Scenario: Layout uses same URL resolution
- **WHEN** Layout.astro passes URLs to Header and Footer
- **THEN** it uses the same `resolveGeneralContentUrls` function

#### Scenario: Fallback URLs applied consistently
- **WHEN** generalContent has no abbreviations or glossary URL
- **THEN** fallback URLs are applied by the shared function, ensuring consistency across page content and header/footer
