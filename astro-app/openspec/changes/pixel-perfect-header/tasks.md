## 1. Desktop Spacing Fixes

- [x] 1.1 [FE] Fix desktop nav item margins in `DesktopNav.astro`: change `.nav-link` margin from `16px 8px` to `16px 16px`
- [x] 1.2 [FE] Fix top toolbar padding in `Header.astro`: change `.toolbar-top` from `padding: 12px 64px` to `padding: 12px 64px` with `padding-right: 60px`
- [x] 1.3 [FE] Fix desktop caret spacing in `DesktopNav.astro`: change `.caret` to `margin-left: 8px; margin-right: -4px`
- [x] 1.4 [FE] Add active page highlighting in `DesktopNav.astro`: `.nav-link--active` with `color: var(--color-accent-primary)`
- [x] 1.5 [FE] Fix top link box-sizing in `Header.astro`: add `box-sizing: content-box` to `.top-link`
- [x] 1.6 [FE] Fix toolbar-bottom height in `Header.astro`: set logo images to `display: inline` and logo link to `line-height: normal`

## 2. Mobile Countries Popup

- [x] 2.1 [FE] Replace `<details class="menu-submenu">` accordion for "Countries & areas" in `MobileNav.astro` with a `<button>` toggle and a floating popup `<div>` (fixed positioned, blue background, white text, border `1px solid #d3d4d5`, `max-height: 558px`, `overflow-y: auto`)
- [x] 2.2 [FE] Add vanilla JS in `MobileNav.astro` script to toggle the countries popup: open on button click, close on outside click (capture phase to prevent click-through), close on item selection, close when the outer mobile menu closes
- [x] 2.3 [FE] Add ARIA attributes to the countries popup: `aria-expanded` on the trigger button, `aria-haspopup="true"`, and Escape key to close

## 3. Mobile Menu Item Spacing

- [x] 3.1 [FE] Fix mobile menu item sizing in `MobileNav.astro`: change `.menu-link` to `padding: 6px 16px`, `min-height: 48px`, `line-height: 1.5`, `white-space: nowrap`, `display: flex; align-items: center`
- [x] 3.2 [FE] Fix hamburger visibility at small viewports: add `flex-shrink: 1; min-width: 0` on `.logo-group` and reduced padding at ≤420px

## 4. Regional Disclaimer Dialog

- [x] 4.1 [FE] Fix dialog sizing: change `max-width` to `min(600px, calc(100vw - 64px))` matching MUI Dialog responsive behavior
- [x] 4.2 [FE] Move close button inside dialog: position `top: 10px; right: 10px`, 44x44px touch target, blue `#035fa7` circular icon
- [x] 4.3 [FE] Add inner content padding: `padding: 16px 16px 8px` on `.regional-dialog-body`
- [x] 4.4 [FE] Fix CTA link alignment: left-aligned with body text, reduced vertical spacing

## 5. Verification & Archive

- [x] 5.1 [FE] Visual comparison and build verification
- [x] 5.2 [FE] Archive updated `header-chrome` spec via `openspec archive`
