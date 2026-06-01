## Context

The Astro app has a placeholder 404 page (`src/pages/404.astro`) that only renders a raw `<h1>` tag. The React SPA has a fully styled `NotFoundPage` component with a header banner (orange background + bubble pattern), a centered "404" display, descriptive text, and a "Go to Homepage" button. The Astro app already has the Layout, Header, Footer, and design token infrastructure in place.

## Goals / Non-Goals

**Goals:**
- Replicate the SPA's 404 page as a static Astro page with no client-side JS
- Reuse the existing Layout component and design tokens for consistency

**Non-Goals:**
- No React islands or interactive components needed
- No changes to routing or Layout component

## Decisions

### 1. Pure Astro component (no React island)

The 404 page has no interactivity — the "Go to Homepage" button is a plain `<a href="/">` link. No need for React or client-side JS.

**Alternative considered**: React island for the button (rejected — unnecessary overhead for a static link).

### 2. Inline scoped styles in 404.astro

All styles will live in a `<style>` block within `404.astro` using Astro's scoped CSS. This keeps the page self-contained and avoids creating shared CSS for a single-use page.

**Alternative considered**: Extracting styles to a shared CSS file (rejected — only used by this page).

### 3. Copy bubble-pattern-white.png to Astro assets

The image asset `bubble-pattern-white.png` needs to be available in the Astro app's `src/assets/` or `public/` directory. We'll copy it from the SPA source and reference it via Astro's asset pipeline.

### 4. Use design tokens for colors

Reuse the existing design token values (`--color-accent-secondary`, etc.) already established in the Astro app for the orange banner and button colors, ensuring consistency with other pages.

## Risks / Trade-offs

- **[Minor visual differences]** → Material UI's Typography provides specific font sizing/spacing. Mitigation: match the exact pixel values from the SPA's styled-components in the Astro scoped CSS.
- **[Asset duplication]** → The bubble pattern PNG will exist in both the SPA and Astro app. Mitigation: acceptable for a PoC; the file is only 20KB.
