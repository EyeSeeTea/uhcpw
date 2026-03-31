## ADDED Requirements

### Requirement: Layout provides HTML shell
The `Layout.astro` component SHALL render a complete HTML document with `<!DOCTYPE html>`, `<html lang="en">`, `<head>`, and `<body>` elements. The `<head>` SHALL include charset (UTF-8), viewport meta tag, and a configurable `<title>` via a `title` prop.

#### Scenario: Page uses Layout with custom title
- **WHEN** a page wraps its content in `<Layout title="Methods">`
- **THEN** the rendered HTML contains `<title>Methods</title>` in the `<head>`

#### Scenario: Page uses Layout with default title
- **WHEN** a page wraps its content in `<Layout>` without a title prop
- **THEN** the rendered HTML contains a default title (e.g., "UHC Data Portal")

### Requirement: Layout includes shared chrome
The Layout SHALL render the Header component before the content slot and the Footer component after the content slot, so every page using the Layout gets consistent navigation and footer.

#### Scenario: Page renders with header and footer
- **WHEN** a page uses `<Layout>` with body content
- **THEN** the rendered HTML contains the header markup before the page content and footer markup after

### Requirement: Layout loads global styles
The Layout SHALL import the design tokens stylesheet (`theme.css`) and any global CSS resets so that all pages share a consistent baseline.

#### Scenario: Theme variables available in page
- **WHEN** a page renders inside the Layout
- **THEN** CSS custom properties from `theme.css` (e.g., `--color-accent-primary`) are available to all child elements

### Requirement: Layout loads web fonts locally
The theme stylesheet SHALL include `@font-face` declarations for the self-hosted Lato font family (regular 400, bold 700, italic 400 at minimum) using woff2/woff files from `public/fonts/`, matching the SPA's approach. No external font services (e.g., Google Fonts) SHALL be used.

#### Scenario: Font loaded via @font-face
- **WHEN** the Layout renders
- **THEN** the theme CSS contains `@font-face` declarations for "Lato" referencing local `/fonts/` files

### Requirement: Layout accepts a content slot
The Layout SHALL use Astro's `<slot />` mechanism so pages inject their unique content between header and footer.

#### Scenario: Page content rendered in slot
- **WHEN** a page places `<h1>Hello</h1>` inside `<Layout>`
- **THEN** the rendered HTML contains `<h1>Hello</h1>` between the header and footer markup
