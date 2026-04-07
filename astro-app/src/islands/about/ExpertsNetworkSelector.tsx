import React from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import OldMuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { muiTheme } from "@shared/webapp/pages/app/themes/dhis2.theme";
import muiThemeLegacy from "@shared/webapp/pages/app/themes/dhis2-legacy.theme";
import { TreeSelector } from "@shared/webapp/components/tree-selector/TreeSelector";

import type { TreeOption } from "@/data/about/about-data";


export interface ExpertsNetworkSelectorProps {
    countryOptions: readonly TreeOption[];
    selectedCountries: readonly string[];
    onSelectedCountriesChange: (ids: string[]) => void;
    parentSort: (a: string, b: string) => number;
}

/**
 * Browser-only TreeSelector wrapper for ExpertsNetwork.
 *
 * Lives in its own module so the legacy MUI v0 imports never enter the SSR
 * module graph — `ExpertsNetwork` loads it via dynamic `import()` after mount.
 */
export const ExpertsNetworkSelector: React.FC<ExpertsNetworkSelectorProps> = ({
    countryOptions,
    selectedCountries,
    onSelectedCountriesChange,
    parentSort,
}) => {
    return (
        <MuiThemeProvider theme={muiTheme}>
            <OldMuiThemeProvider muiTheme={muiThemeLegacy}>
                {/* @ts-expect-error TS2786: TreeSelector's React 17 FC return type (ReactElement) is not assignable to React 18's ReactNode */}
                <TreeSelector
                    hasSelectAll
                    hasClearAll
                    topClearAll={-35}
                    items={[...countryOptions]}
                    selectedIds={[...selectedCountries]}
                    onSelectedIdsChange={onSelectedCountriesChange}
                    placeholder="Select country or area"
                    showParentIfChecked={true}
                    showOnlyAllParentSelectedIfChecked={true}
                    allSelectedLabel="All countries/areas"
                    parentSort={parentSort}
                />
            </OldMuiThemeProvider>
        </MuiThemeProvider>
    );
};

ExpertsNetworkSelector.displayName = "ExpertsNetworkSelector";
