import React, { useState, useMemo } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import OldMuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { muiTheme } from "@shared/webapp/pages/app/themes/dhis2.theme";
import muiThemeLegacy from "@shared/webapp/pages/app/themes/dhis2-legacy.theme";
import { TreeSelector } from "@shared/webapp/components/tree-selector/TreeSelector";
import { PersonCardReact } from "./PersonCardReact";

import type { TreeOption } from "@/data/about/about-data";
import type { PersonState } from "@/data/about/about-data";

export interface ExpertsNetworkProps {
    experts: readonly PersonState[];
    countryOptions: readonly TreeOption[];
    parentSortOrder: readonly string[];
    title: string;
    subtitle: string;
}

export const ExpertsNetwork: React.FC<ExpertsNetworkProps> = ({
    experts,
    countryOptions,
    parentSortOrder,
    title,
    subtitle,
}) => {
    const [selectedCountries, setSelectedCountries] = useState<string[]>([]);

    const parentSort = useMemo(
        () => (a: string, b: string) => parentSortOrder.indexOf(a) - parentSortOrder.indexOf(b),
        [parentSortOrder]
    );

    const filteredExperts = useMemo(() => {
        if (selectedCountries.length === 0) return experts;
        return experts.filter(expert => expert.countryId !== undefined && selectedCountries.includes(expert.countryId));
    }, [experts, selectedCountries]);

    return (
        <MuiThemeProvider theme={muiTheme}>
            <OldMuiThemeProvider muiTheme={muiThemeLegacy}>
                <section>
                    <div className="experts-title-container">
                        <h3 className="experts-title">{title}</h3>
                        <h5 className="experts-subtitle">{subtitle}</h5>
                    </div>

                    <div className="experts-selector-row">
                        {/* @ts-expect-error TS2786: TreeSelector's React 17 FC return type (ReactElement) is not assignable to React 18's ReactNode */}
                        <TreeSelector
                            hasSelectAll
                            hasClearAll
                            topClearAll={-35}
                            items={countryOptions as TreeOption[]}
                            selectedIds={selectedCountries}
                            onSelectedIdsChange={setSelectedCountries}
                            placeholder="Select country or area"
                            showParentIfChecked={true}
                            showOnlyAllParentSelectedIfChecked={true}
                            allSelectedLabel="All countries/areas"
                            parentSort={parentSort}
                        />
                    </div>

                    <div className="experts-grid" role="list" aria-label="Experts network">
                        {filteredExperts.map((expert, index) => (
                            <PersonCardReact key={`${expert.firstName}-${expert.lastName}-${index}`} person={expert} />
                        ))}
                    </div>
                </section>
            </OldMuiThemeProvider>
        </MuiThemeProvider>
    );
};

ExpertsNetwork.displayName = "ExpertsNetwork";
