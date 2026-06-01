## MODIFIED Requirements

### Requirement: ExpertsNetwork CSS in a separate file
ExpertsNetwork island styles SHALL be defined in a dedicated CSS file imported at the Astro page level, not injected as a `<style>` string at hydration time.

#### Scenario: No FOUC on experts section
- **WHEN** the about page loads
- **THEN** ExpertsNetwork styles are available in the document before JS hydrates

#### Scenario: CSS uses design token variables
- **WHEN** ExpertsNetwork styles define font-family
- **THEN** they use `var(--font-family-base)` instead of hardcoded font stacks

### Requirement: PersonCardReact uses shared constant
PersonCardReact SHALL import AVATAR_FALLBACK from `data/about/constants.ts`.

#### Scenario: Fallback imported from shared location
- **WHEN** PersonCardReact needs the avatar fallback path
- **THEN** it imports from `data/about/constants.ts`
