## Why

The Astro experts section on `/about` renders the shared `TreeSelector` component with visible styling regressions compared to the React SPA, breaking pixel-perfect parity. The search field is nearly half its expected height, the "Select all" / "Clear all" / "Clear" action buttons lose their orange color and non-uppercase casing, the selected chips lose their light-blue background, and the floating "Clear" affordance is positioned incorrectly instead of appearing above and to the right of the input.

## What Changes

- Restore the TreeSelector search input height to match the SPA (42px including border + padding, driven by the `SearchInput` `makeStyles` padding of `10px` around a 20px inner input), fixing the current 22px render.
- Restore the TreeSelector action buttons ("Select all", "Clear all", and the floating "Clear") to render with `color: orange`, `text-transform: none`, and `font-weight: 400`, matching the SPA's `StyledButton` / `StyledButtonClear` styled-components definitions.
- Restore the SelectedChip background color to `#cfe9f7` and `border-radius: 20px` inside the TreeSelector input.
- Restore the left-side spacing before the "(N selected)" placeholder text so it matches the SPA's spacing.
- Reposition the floating "Clear" button (visible only when at least one country is selected) so it sits above and to the right of the selector, matching the SPA's `topClearAll={-35}` + `right={-15}` absolute positioning.

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `experts-country-filter`: Adds visual/style requirements for the TreeSelector rendering inside the experts island so it matches the SPA pixel-perfectly (search field height, button color/casing, selected chip background, placeholder spacing, floating Clear button position).

## Impact

- **Files likely affected**: `astro-app/src/styles/experts-network.css` (scoped CSS overrides targeting the TreeSelector markup), possibly `astro-app/src/islands/about/ExpertsNetworkSelector.tsx` (if additional providers or a `StyleSheetManager` wrapper are needed), and possibly `astro-app/astro.config.mjs` (if Vite dedupe for `styled-components` / `@material-ui/styles` is required).
- **Visual**: The experts section will match the SPA pixel-for-pixel at desktop, tablet, and mobile viewports.
- **Behavior**: No behavioral changes — filtering, selection, clear, select-all, and keyboard/a11y behavior remain as-is.
- **No breaking changes** to component APIs, data shape, routing, or build output.

## Goals

- Pixel-perfect parity for the experts TreeSelector with the SPA across desktop/tablet/mobile viewports.
- Fix the regressions without forking the shared TreeSelector component — keep the SPA component as the single source of truth.

## Non-goals

- Rewriting or restyling the TreeSelector itself in the shared React SPA codebase.
- Refactoring the experts island architecture (island boundary, dynamic import, provider wrapping).
- Fixing unrelated TreeSelector issues outside of the five symptoms listed above.

## Compatibility

All changes are visual/CSS-layer. No API, data, URL, or build-output changes. Fully backward-compatible.

## Rollback plan

Revert the CSS overrides in `experts-network.css` (and any `ExpertsNetworkSelector.tsx` / `astro.config.mjs` changes) to restore the current rendering.
