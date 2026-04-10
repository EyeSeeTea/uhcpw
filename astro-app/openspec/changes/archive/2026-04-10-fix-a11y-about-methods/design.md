## Context

Both the About and Methods pages currently use incorrect heading hierarchies:
- **No H1** on either page — headings start at H3
- **Skipped levels**: H3 jumps to H5 (skipping H4) for subtitles

This breaks the document outline for screen readers. The heading tags were likely chosen for visual sizing rather than semantic structure — a common pattern inherited from the SPA where MUI Typography controlled heading appearance.

Affected files:
- `src/pages/about.astro` — H3 for page title
- `src/components/about/TeamSection.astro` — H3 title + H5 subtitle
- `src/islands/about/ExpertsNetwork.tsx` — H3 title + H5 subtitle
- `src/pages/methods.astro` — H3 for page title, H5 for section names

## Goals / Non-Goals

**Goals:**
- Each page has exactly one H1 (the page title)
- Headings follow sequential hierarchy (H1 → H2 → H3, no skipped levels)
- No visual changes — existing CSS handles all typography styling via class selectors

**Non-Goals:**
- Adding skip-nav links, ARIA live regions, or focus management
- Fixing heading levels inside markdown-rendered content from DHIS2
- Changing the Layout or Header components (those have their own heading concerns)
- Creating wireframes (no visual change — purely semantic HTML tag swaps)

## Decisions

### Decision 1: Promote page titles to H1, section titles to H2, subtitles to H3

**Rationale:** The simplest correct hierarchy. Each page has one topic (H1), with logical sections beneath it (H2), and sub-sections below those (H3).

**Mapping:**

| Page | Current | New | Element |
|------|---------|-----|---------|
| About | H3 "WHO Barcelona Office..." | H1 | Page title banner |
| About | H3 "The WHO Barcelona Office team" | H2 | Team section title |
| About | H5 "Staff and consultants" | H3 | Team section subtitle |
| About | H3 "The Financial Protection Expert Network" | H2 | Experts section title |
| About | H5 (experts subtitle) | H3 | Experts section subtitle |
| Methods | H3 "Methods" | H1 | Page title banner |
| Methods | H5 (method section names) | H2 | Individual method headings |

**Alternative considered:** Using a visually hidden H1 and keeping existing tags with adjusted levels. Rejected because the existing page title banners already serve as H1 content — hiding them would duplicate information.

### Decision 2: Retain all existing CSS classes for visual styling

All heading styles are already controlled by CSS class selectors (`.title-container h3`, `.team-section .subtitle`, etc.), not by tag selectors. Changing the HTML tag won't affect visual appearance as long as we update the CSS selectors to match the new tags.

**Approach:** Update CSS selectors from tag-specific (e.g., `h3`, `h5`) to match the new heading levels, or use the existing class-only selectors where they already exist.

### Decision 3: ExpertsNetwork.tsx heading level via props

The ExpertsNetwork React island currently hardcodes H3/H5. Since it receives `title` and `subtitle` as props, the heading tags should simply be changed in the component. No new props needed — the hierarchy is fixed (always H2/H3 in the experts section).

## Risks / Trade-offs

- **[CSS specificity]** → Some styles may use tag selectors like `.title-container h3`. Mitigation: audit and update all tag-based selectors in the affected components' `<style>` blocks.
- **[SPA visual parity]** → Changing heading tags could theoretically diverge from SPA appearance. Mitigation: the SPA uses MUI `variant` prop for sizing, not semantic tags — so the Astro CSS classes already control appearance independently.
