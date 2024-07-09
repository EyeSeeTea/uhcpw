import { Button, Grid, Typography } from "@material-ui/core";
import React, { useCallback } from "react";
import styled from "styled-components";
import { useHistory, useLocation } from "react-router-dom";
import i18n from "../../../locales";
import { PolicyExplorerFiltersState } from "../../pages/policy-explorer/PolicyExplorerState";
import { TreeSelector } from "../tree-selector/TreeSelector";
import { DropdownMultiple } from "../dropdown/DropdownMultiple";
import { CategorySelector } from "./category-selector/CategorySelector";

export interface ResourcesFiltersProps {
    filters: PolicyExplorerFiltersState;
    onGetTable: () => void;
}

export const PolicyExplorerFilters: React.FC<ResourcesFiltersProps> = React.memo(({ filters, onGetTable }) => {
    const history = useHistory();
    const location = useLocation();

    const onCategoryChange = useCallback(
        (value: Record<string, string[]> | undefined) => {
            const queryParameters = new URLSearchParams(location.search);

            if (value) {
                queryParameters.set("category", JSON.stringify(value));
            } else if (!value) {
                queryParameters.delete("category");
            }
            filters.category.onSelectedChange(value);
            history.push({ search: queryParameters.toString() });
        },
        [filters.category, history, location.search]
    );

    const onCountryChange = useCallback(
        (value: string[] | undefined) => {
            const queryParameters = new URLSearchParams(location.search);

            if (value && value.length > 0) {
                queryParameters.set("country", value?.join(","));
            } else {
                queryParameters.delete("country");
            }

            filters.country.onSelectedChange(value);
            history.push({ search: queryParameters.toString() });
        },
        [filters.country, history, location.search]
    );

    const onYearsChange = useCallback(
        (value: string[] | undefined) => {
            const queryParameters = new URLSearchParams(location.search);

            if (value && value.length > 0) {
                queryParameters.set("years", value?.join(","));
            } else {
                queryParameters.delete("years");
            }

            filters.year.onSelectedChange(value);
            history.push({ search: queryParameters.toString() });
        },
        [filters.year, history, location.search]
    );

    return (
        <Grid container alignItems="flex-end" justifyContent="center">
            <Grid item md={4} sm={6}>
                <Wrapper>
                    <CategorySelector
                        fullWidth
                        label={i18n.t("Categories")}
                        placeholder={i18n.t("Select category")}
                        categoryOptions={filters.category.options}
                        selectedCategoriesWithSubcategories={filters.category.selected}
                        onSelect={onCategoryChange}
                    />
                </Wrapper>
            </Grid>
            <Grid item md={4} sm={6}>
                <Wrapper>
                    <TreeSelector
                        fullWidth
                        hasClearAll
                        hasSelectAll
                        label={i18n.t("Countries and areas")}
                        items={filters.country.options}
                        selectedIds={filters.country.selected}
                        onSelectedIdsChange={onCountryChange}
                        placeholder={i18n.t("Select country or area")}
                        disabledItems={filters.country.disabledCountries}
                        showSubChildren={filters.country.showSubRegions}
                        defaultExpanded={filters.country.defaultExpandedCountries}
                    />
                </Wrapper>
            </Grid>
            <Grid item md={3} sm={6}>
                <Wrapper>
                    <DropdownMultiple
                        fullWidth
                        label={i18n.t("Years")}
                        placeholder={i18n.t("Select year")}
                        options={filters.year.options}
                        values={filters.year.selected}
                        onChange={onYearsChange}
                    />
                </Wrapper>
            </Grid>
            <GridGetTableButton item md={1} sm={2}>
                <GetTableButton
                    aria-label="Get table"
                    variant="contained"
                    color="primary"
                    disabled={
                        !filters.category.selected ||
                        !Object.keys(filters.category.selected)?.length ||
                        !filters.country.selected?.length ||
                        !filters.year.selected?.length
                    }
                    onClick={onGetTable}
                >
                    <Typography>{i18n.t("Get table")}</Typography>
                </GetTableButton>
            </GridGetTableButton>
        </Grid>
    );
});

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-inline-end: 40px;
`;

const GetTableButton = styled(Button)`
    border-radius: 20px;
    height: 50px;
    text-transform: none;
    white-space: nowrap;
    background: #185698;
`;

const GridGetTableButton = styled(Grid)`
    text-align: end;
`;
