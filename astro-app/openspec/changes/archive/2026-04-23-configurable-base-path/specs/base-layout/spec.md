## MODIFIED Requirements

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
