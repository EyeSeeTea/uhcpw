/**
 * Regression guard for the MUI JSS vs styled-components cascade fix.
 *
 * The shared TreeSelector relies on styled-components overriding MUI v4's
 * default button/chip styles (orange color, non-uppercase labels, custom chip
 * background). That only works if MUI's JSS sheets are injected BEFORE
 * styled-components' sheet so styled-components rules win the cascade. Astro's
 * default insertion order is reversed; wrapping the island in
 * `<StylesProvider injectFirst>` fixes it.
 *
 * Runtime rendering of the real component is blocked in jsdom because the
 * monorepo-root `@material-ui/styles` resolves its own React 17 alongside
 * astro-app's React 18 ("Invalid hook call"). We mock the shared/MUI imports
 * so we can assert the JSX invariant: `StylesProvider` with `injectFirst` sits
 * above `MuiThemeProvider`, which sits above the legacy provider and the
 * `TreeSelector`.
 */
import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import React from "react";

vi.mock("@material-ui/styles", () => ({
    StylesProvider: ({ injectFirst, children }: { injectFirst?: boolean; children: React.ReactNode }) => (
        <div data-testid="styles-provider" data-inject-first={String(!!injectFirst)}>
            {children}
        </div>
    ),
}));

vi.mock("@material-ui/core/styles", () => ({
    MuiThemeProvider: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="mui-theme-provider">{children}</div>
    ),
}));

vi.mock("material-ui/styles/MuiThemeProvider", () => ({
    default: ({ children }: { children: React.ReactNode }) => (
        <div data-testid="legacy-mui-theme-provider">{children}</div>
    ),
}));

vi.mock("@shared/webapp/pages/app/themes/dhis2.theme", () => ({ muiTheme: {} }));
vi.mock("@shared/webapp/pages/app/themes/dhis2-legacy.theme", () => ({ default: {} }));

vi.mock("@shared/webapp/components/tree-selector/TreeSelector", () => ({
    TreeSelector: () => <div data-testid="tree-selector" />,
}));

import { ExpertsNetworkSelector } from "../ExpertsNetworkSelector";

describe("ExpertsNetworkSelector (cascade regression guard)", () => {
    it("wraps the MUI theme providers in <StylesProvider injectFirst>", () => {
        const { getByTestId } = render(
            <ExpertsNetworkSelector
                countryOptions={[]}
                selectedCountries={[]}
                onSelectedCountriesChange={() => undefined}
                parentSort={() => 0}
            />
        );

        const stylesProvider = getByTestId("styles-provider");
        expect(stylesProvider.getAttribute("data-inject-first")).toBe("true");

        // Nesting: StylesProvider → MuiThemeProvider → legacy provider → TreeSelector.
        expect(stylesProvider.contains(getByTestId("mui-theme-provider"))).toBe(true);
        expect(getByTestId("mui-theme-provider").contains(getByTestId("legacy-mui-theme-provider"))).toBe(true);
        expect(getByTestId("legacy-mui-theme-provider").contains(getByTestId("tree-selector"))).toBe(true);
    });
});
