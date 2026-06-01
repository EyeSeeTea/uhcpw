## 1. Design Tokens & Global Styles

- [x] 1.1 [FE] Create `src/styles/theme.css` with CSS custom properties for colors (accent primary, dark blue, blues scale, greys, status colors), typography (font family, base size), and breakpoints (960px, 600px). Include CSS resets (box-sizing, body margin, font rendering).
- [x] 1.2 [FE] Add Lato font — either via Google Fonts `<link>` or self-hosted `@font-face` declarations in `theme.css`.

## 2. Static Assets

- [x] 2.1 [FE] Copy WHO logo, UHC Data Portal logo, and EU flag images from the React SPA's `public/` directory into `astro-app/public/images/`.

## 3. Base Layout

- [x] 3.1 [FE] Create `src/layouts/Layout.astro` — HTML shell with `<html lang="en">`, `<head>` (charset, viewport, title prop with default, theme.css import, font link), `<body>` with Header, `<slot />`, and Footer.
- [x] 3.2 [FE] Update existing stub pages (`about.astro`, `methods.astro`, `404.astro`) to wrap their content in `<Layout>`.

## 4. Header

- [x] 4.1 [FE] Create `src/components/layout/Header.astro` — top bar with office title and reference links, logo bar with WHO + UHC logos, and a navigation slot area.
- [x] 4.2 [FE] Create `src/components/layout/DesktopNav.astro` — horizontal nav bar with links to Home, Methods, About. Visible above 960px, hidden at or below.
- [x] 4.3 [FE] Create `src/components/layout/MobileNav.astro` — hamburger icon toggling a `<details>`/`<summary>` menu with links to Home, Methods, About. Visible at 960px or below, hidden above. Include inline `<script>` for close-on-outside-click and close-on-link-click.
- [x] 4.4 [FE] Integrate DesktopNav and MobileNav into Header.astro.

## 5. Footer

- [x] 5.1 [FE] Create `src/components/layout/Footer.astro` — desktop layout: multi-column grid with WHO disclaimer, EU co-funding, About Us link, Contact Us info. Mobile layout: `<details>`/`<summary>` accordion sections. Copyright bar at bottom.
- [x] 5.2 [FE] Style the footer responsive breakpoints — grid columns above 960px, stacked accordion below.

## 6. Validation

- [x] 6.1 [FE] Run `astro build` and verify the generated HTML for each page includes header, footer, theme tokens, and correct `<title>`.
- [x] 6.2 [FE] Visually compare the rendered header and footer against the React SPA at desktop (>960px) and mobile (<600px) widths.
- [x] 6.3 [FE] Verify mobile menu toggle opens/closes correctly and accordion footer sections expand/collapse.
- [x] 6.4 [FE] Run `yarn lint` and confirm no new lint errors.
