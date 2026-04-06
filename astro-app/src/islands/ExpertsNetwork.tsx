import React, { useState, useMemo } from "react";
import { MuiThemeProvider } from "@material-ui/core/styles";
import OldMuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import { muiTheme } from "@shared/webapp/pages/app/themes/dhis2.theme";
import muiThemeLegacy from "@shared/webapp/pages/app/themes/dhis2-legacy.theme";
import { TreeSelector } from "@shared/webapp/components/tree-selector/TreeSelector";
import { PersonCardReact } from "./PersonCardReact";

import type { TreeOption } from "../lib/about-data";
import type { PersonState } from "../lib/about-data";

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
        () => (a: string, b: string) =>
            parentSortOrder.indexOf(a) - parentSortOrder.indexOf(b),
        [parentSortOrder]
    );

    const filteredExperts = useMemo(() => {
        if (selectedCountries.length === 0) return experts;
        return experts.filter(
            expert =>
                expert.countryId !== undefined &&
                selectedCountries.includes(expert.countryId)
        );
    }, [experts, selectedCountries]);

    return (
        <MuiThemeProvider theme={muiTheme}>
        <OldMuiThemeProvider muiTheme={muiThemeLegacy}>
        <section>
            <style>{responsiveStyles}</style>

            <div className="experts-title-container">
                <h3 className="experts-title">{title}</h3>
                <h5 className="experts-subtitle">{subtitle}</h5>
            </div>

            <div className="experts-selector-row">
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
                    <PersonCardReact
                        key={`${expert.firstName}-${expert.lastName}-${index}`}
                        person={expert}
                    />
                ))}
            </div>
        </section>
        </OldMuiThemeProvider>
        </MuiThemeProvider>
    );
};

ExpertsNetwork.displayName = "ExpertsNetwork";

const responsiveStyles = `
    .experts-title-container {
        padding: 64px 32px 16px 32px;
    }
    .experts-title {
        font-weight: 500;
        font-family: Lato, Roboto, Helvetica, Arial, sans-serif;
        margin: 0;
        font-size: 3rem;
        line-height: 1.167;
    }
    .experts-subtitle {
        color: rgba(36, 38, 38, 0.7);
        max-width: 50%;
        margin-top: 10px;
        margin-bottom: 0;
        font-family: Lato, Roboto, Helvetica, Arial, sans-serif;
        font-weight: 400;
        font-size: 1.5rem;
        line-height: 1.334;
    }
    .experts-selector-row {
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        flex-wrap: wrap;
        padding: 16px 32px 32px 32px;
    }
    .experts-grid {
        display: flex;
        flex-wrap: wrap;
        margin: -24px;
        padding: 0 32px 32px;
        margin-bottom: 6px;
    }
    .experts-grid > [role="listitem"] {
        flex-grow: 1;
        flex-basis: 0;
        max-width: 100%;
        padding: 24px;
    }

    /* PersonCardReact styles */
    .person-card {
        display: flex;
        position: relative;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
    }
    .person-card-inner {
        display: flex;
        border-radius: 10px;
        padding: 16px;
        flex-direction: column;
        align-items: center;
    }
    .person-card-image {
        width: 200px;
        height: 200px;
        max-width: none;
        border-radius: 50%;
        margin-bottom: 6px;
        object-fit: cover;
        object-position: 50% 0%;
    }
    .person-card-row {
        padding-top: 8px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    .person-card-info {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .person-card-name {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
    }
    .person-card-name-first {
        font-family: Lato, Roboto, Helvetica, Arial, sans-serif;
        font-weight: bold;
        white-space: nowrap;
        margin: 0 5px -1px 0;
        font-size: 1rem;
        line-height: 1.5;
    }
    .person-card-name-last {
        font-family: Lato, Roboto, Helvetica, Arial, sans-serif;
        font-weight: bold;
        white-space: nowrap;
        margin: 0;
        font-size: 1rem;
        line-height: 1.5;
    }
    .person-card-text {
        text-align: center;
        font-family: Lato, Roboto, Helvetica, Arial, sans-serif;
        margin: 0 0 4px 0;
        font-size: 1rem;
        line-height: 1.5;
    }

    @media (max-width: 959px) {
        .experts-title-container {
            padding: 32px 32px 16px 32px;
        }
        .experts-subtitle {
            max-width: 100%;
        }
        .experts-grid > [role="listitem"] {
            flex-grow: 0;
            flex-basis: 50%;
            max-width: 50%;
        }
    }
    @media (max-width: 599px) {
        .person-card-image {
            width: 150px;
            height: 150px;
        }
    }
`;
