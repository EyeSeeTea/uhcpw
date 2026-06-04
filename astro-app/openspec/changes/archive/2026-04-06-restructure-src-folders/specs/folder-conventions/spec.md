## ADDED Requirements

### Requirement: Source directory structure follows separation of concerns
The `src/` directory SHALL organize files into the following top-level directories, each with a single purpose:

| Directory | Purpose | Example |
|-----------|---------|---------|
| `data/<feature>/` | Page-specific data fetching, shaping, and validation | `data/about/about-data.ts` |
| `infra/` | Framework glue: API initialization, adapter patterns | `infra/composition-root.server.ts` |
| `lib/` | Generic, reusable utilities with no domain knowledge | `lib/markdown.ts` |
| `islands/<feature>/` | React islands grouped by the page/feature they serve | `islands/about/ExpertsNetwork.tsx` |
| `components/<feature>/` | Astro components grouped by feature | `components/about/PersonCard.astro` |
| `pages/` | Astro page routes | `pages/about.astro` |
| `layouts/` | Astro layout wrappers | `layouts/Layout.astro` |
| `styles/` | Global CSS and design tokens | `styles/theme.css` |
| `types/` | TypeScript type declarations | `types/parent-compat.d.ts` |

#### Scenario: New page data logic goes in data/
- **WHEN** a developer adds data-fetching logic for a new "resources" page
- **THEN** the files SHALL be placed in `src/data/resources/`, not in `src/lib/`

#### Scenario: New generic utility goes in lib/
- **WHEN** a developer adds a date formatting utility with no domain knowledge
- **THEN** the file SHALL be placed in `src/lib/`, not in `src/data/` or `src/infra/`

#### Scenario: New island goes in feature subdirectory
- **WHEN** a developer creates a React island for the methods page
- **THEN** the file SHALL be placed in `src/islands/methods/`

### Requirement: Tests use __tests__/ subfolder convention
All test files SHALL be placed in a `__tests__/` subdirectory within their parent module directory. Colocated sibling test files (e.g., `foo.test.ts` next to `foo.ts`) SHALL NOT be used.

#### Scenario: Test for a data module
- **WHEN** a test is written for `src/data/about/about-data.ts`
- **THEN** it SHALL be placed at `src/data/about/__tests__/about-data.test.ts`

#### Scenario: Test for an island
- **WHEN** a test is written for `src/islands/about/ExpertsNetwork.tsx`
- **THEN** it SHALL be placed at `src/islands/about/__tests__/ExpertsNetwork.test.tsx`

### Requirement: AGENTS.md documents folder conventions
The `AGENTS.md` file SHALL contain a section describing the `src/` directory structure, the purpose of each top-level directory, and the test placement convention. This serves as guidance for AI-assisted development.

#### Scenario: AGENTS.md includes folder structure guide
- **WHEN** an AI agent reads `AGENTS.md` before creating a new file
- **THEN** it finds clear instructions on which directory to use based on the file's purpose
