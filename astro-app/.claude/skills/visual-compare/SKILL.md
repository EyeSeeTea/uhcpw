---
name: visual-compare
description: Compares the Astro app against the React SPA visually and structurally using screenshots, DOM snapshots, and computed styles. Use when you need to verify visual parity between the Astro static site and the original React SPA.
allowed-tools: Bash(playwright-cli:*), Read
---

# Visual Comparison: Astro vs React SPA

Compare pages between the Astro static site and the React SPA using a combination of screenshots, DOM snapshots, and style inspection. Screenshots are one tool — not the only one.

## Input

The argument is a **page path** (e.g., `/about`, `/methods`) or `all` to compare all known pages.

If no argument is provided, use **AskUserQuestion** to ask which page to compare.

## Prerequisites

Both dev servers must be running before this skill executes:
- **Astro app**: `yarn start` in `astro-app/` (default: http://localhost:4321)
- **React SPA**: `yarn start` in root project (default: http://localhost:8081)

If the user hasn't started them, tell them to run these commands first (in separate terminals):
```
# Terminal 1 — Astro
cd astro-app && nvm use && yarn start

# Terminal 2 — React SPA
cd .. && nvm use && PORT=8081 yarn start
```

**Important**: Each project may require a different Node version. Always run `nvm use` before starting either server so the correct version from `.nvmrc` is loaded.

## Configuration

```
ASTRO_BASE=http://localhost:4321
SPA_BASE=http://localhost:8081
SCREENSHOT_DIR=./screenshots/visual-compare
```

## SPA Routing

The React SPA uses **hash-based routing**. To navigate to a page, use the `#/` prefix:
- Astro: `http://localhost:4321/about`
- SPA: `http://localhost:8081/#/about`

## Waiting for SPA Load

The SPA fetches data from DHIS2 on initial load, which can take several seconds. **Do not screenshot immediately after navigation.** Use one of these strategies to wait:

1. **Network idle check** (preferred): Wait until there are no pending network requests.
   ```bash
   playwright-cli -s=spa eval "await new Promise(r => { let t; const check = () => { clearTimeout(t); t = setTimeout(r, 2000); }; const obs = new PerformanceObserver(check); obs.observe({type: 'resource'}); check(); })"
   ```

2. **Wait for a known element**: Use `snapshot` and check for expected content before screenshotting.
   ```bash
   playwright-cli -s=spa snapshot
   # Check if page content is present, retry if still showing spinner
   ```

3. **Hardcoded wait** (fallback): If the above don't work, wait 5 seconds.
   ```bash
   sleep 5
   ```

The Astro app is static HTML — no wait needed.

## Viewports

Compare at these sizes (matching the SPA's breakpoints):
1. **Desktop**: 1440×900
2. **Tablet**: 960×768
3. **Mobile**: 375×812

## Comparison Toolkit

Use the right tool for each aspect of comparison. **Screenshots are not always necessary** — often a DOM snapshot or style query is faster and more precise.

### Screenshots (visual overview)
Take when you need a broad visual impression or to spot layout/color issues.
```bash
playwright-cli -s=astro screenshot --filename=screenshots/visual-compare/<page>-astro-<viewport>.png
```
Then use the **Read** tool to view and compare.

### DOM Snapshots (structure comparison)
Use `snapshot` to compare element structure, text content, link targets, and accessibility tree without needing to visually parse a screenshot.
```bash
playwright-cli -s=astro snapshot
playwright-cli -s=spa snapshot
```
Good for: verifying nav items, link hrefs, heading hierarchy, aria labels, text content.

### Computed Styles (precise CSS comparison)
Use `eval` to query computed styles on specific elements when you need exact values.
```bash
# Get background color of the header
playwright-cli -s=astro eval "getComputedStyle(document.querySelector('.toolbar-top')).background"
# Get font-family
playwright-cli -s=spa eval "getComputedStyle(document.querySelector('header')).fontFamily"
# Compare padding
playwright-cli -s=astro eval "getComputedStyle(document.querySelector('.footer-top')).padding"
```
Good for: verifying exact colors, font sizes, spacing, breakpoint behavior.

### Element Visibility / Layout
```bash
# Check element dimensions
playwright-cli -s=astro eval "document.querySelector('.desktop-nav').getBoundingClientRect().width"
# Check if element is visible
playwright-cli -s=spa eval "getComputedStyle(document.querySelector('.mobile-menu')).display"
```

### Scroll to Sections
```bash
# Scroll to footer to compare it
playwright-cli -s=astro eval "window.scrollTo(0, document.body.scrollHeight)"
# Scroll to a specific section
playwright-cli -s=spa eval "document.querySelector('#footer').scrollIntoView()"
```

## Steps

1. **Create screenshot directory**
   ```bash
   mkdir -p screenshots/visual-compare
   ```

2. **Open two browser sessions**
   ```bash
   playwright-cli -s=astro open $ASTRO_BASE
   playwright-cli -s=spa open $SPA_BASE
   ```

3. **For each page path** (from the argument or `all`):

   a. **Navigate both sessions** (remember SPA uses hash routes, and needs a load wait)
      ```bash
      playwright-cli -s=astro goto $ASTRO_BASE<path>
      playwright-cli -s=spa goto $SPA_BASE/#<path>
      # Wait for SPA to finish loading (see "Waiting for SPA Load" above)
      ```

   b. **For each viewport**, resize and compare using the appropriate tools:
      - Start with **DOM snapshots** to compare structure and content
      - Use **computed style queries** for specific CSS values that look off
      - Take **screenshots** for overall visual impression or when structure checks pass but something still looks wrong

4. **Report results**

   For each page/viewport pair, report:
   - Whether the layout matches (header, footer, content structure)
   - Color/typography differences (with exact values if queried)
   - Spacing/alignment issues
   - Missing elements
   - Responsive behavior differences

   Format as a table:
   ```
   | Page    | Viewport | Match | Notes                        |
   |---------|----------|-------|------------------------------|
   | /about  | desktop  | ✓     | Header matches, minor spacing|
   | /about  | mobile   | ~     | Menu icon differs slightly   |
   ```

5. **Close browser sessions**
   ```bash
   playwright-cli -s=astro close
   playwright-cli -s=spa close
   ```

## Known Pages

- `/about`
- `/methods`

## Guardrails

- Always close browser sessions when done (even on error)
- Don't modify any source files — this is a read-only comparison
- If a dev server is not reachable, report it clearly and stop
- Screenshots go in `screenshots/visual-compare/` (gitignored)
- Prefer DOM snapshots and style queries over screenshots when checking specific details
- Only take screenshots when a broad visual check is needed or when you want to show the user
