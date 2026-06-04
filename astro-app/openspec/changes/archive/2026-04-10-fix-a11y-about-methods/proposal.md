## Why

The About and Methods pages have broken heading hierarchies: no H1 tags, and headings skip from H3 to H5 (bypassing H4). This creates a confusing document outline for screen readers and assistive technologies, and hurts SEO. Fixing this now prevents these issues from being carried forward as the static site matures.

## What Changes

- Add a visually hidden H1 to each page to provide a proper document title for assistive technologies
- Fix heading levels across both pages so they follow a sequential hierarchy (no skipped levels)
- Ensure subtitle elements use the correct heading level relative to their parent heading
- Improve semantic HTML where title containers use plain `<div>` instead of appropriate elements

## Capabilities

### New Capabilities

_None_ - this change modifies existing capabilities only.

### Modified Capabilities

- `about-page-rendering`: Heading hierarchy changes from H3/H5 to proper sequential levels; add H1
- `methods-page-rendering`: Heading hierarchy changes from H3/H5 to proper sequential levels; add H1

## Impact

- **Affected components**: `about.astro`, `methods.astro`, `TeamSection.astro`, `ExpertsNetwork.tsx`
- **Visual impact**: None if headings retain their existing CSS styling (font-size, weight, etc.) regardless of HTML tag changes
- **Compatibility**: No breaking changes; purely structural HTML improvements
- **Rollback plan**: Revert heading tags to original levels; no data or API changes involved

## Goals

- Every page has exactly one H1
- Heading levels never skip (e.g., H2 -> H4 without H3)
- Subtitles use the next sequential heading level below their parent

## Non-goals

- Auditing or fixing a11y on pages beyond About and Methods
- Changing visual design or typography
- Adding ARIA live regions, skip links, or other a11y enhancements beyond heading hierarchy
- Fixing markdown-rendered content heading levels (data-level concern)
