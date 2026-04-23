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
The `Layout.astro` component SHALL declare `@font-face` rules for the self-hosted Lato font family (regular 400, bold 700, italic 400) using woff2/woff files imported from `src/assets/fonts/` via Vite `?url` imports. The `@font-face` declarations SHALL be emitted inline in the layout (via `<style set:html={…} is:global>`) so the fingerprinted URLs in `src` exactly match the URLs used by `<link rel="preload">`. No external font services (e.g., Google Fonts) SHALL be used, and `theme.css` SHALL NOT contain `@font-face` rules.

#### Scenario: Fonts loaded via Vite-imported URLs
- **WHEN** the Layout renders
- **THEN** the document contains a `<style>` block with `@font-face` rules whose `src` URLs point to `/_astro/Lato-*.<hash>.woff2` (and `.woff` fallback)

#### Scenario: Preload URL matches font-face URL
- **WHEN** the site is built and the home page is loaded
- **THEN** the URL of the `<link rel="preload" as="font">` for Regular and Bold equals the URL the browser requests via `@font-face` (single network request per font)

#### Scenario: Italic declared without preload
- **WHEN** the Layout renders
- **THEN** Italic is declared in `@font-face` but no `<link rel="preload">` is emitted for it

### Requirement: Layout accepts a content slot
The Layout SHALL use Astro's `<slot />` mechanism so pages inject their unique content between header and footer.

#### Scenario: Page content rendered in slot
- **WHEN** a page places `<h1>Hello</h1>` inside `<Layout>`
- **THEN** the rendered HTML contains `<h1>Hello</h1>` between the header and footer markup
## Requirements
### Requirement: Layout renders build info meta tag
The Layout SHALL render a single `<meta name="build-info" content="v{version} / {commit} / {buildDate}">` tag inside `<head>`, with values sourced from the build-info resolver at build time.

#### Scenario: Meta tag appears in head
- **WHEN** any page uses `<Layout>`
- **THEN** the rendered HTML `<head>` contains exactly one `<meta name="build-info" content="...">` tag with the current build's version, commit, and date

