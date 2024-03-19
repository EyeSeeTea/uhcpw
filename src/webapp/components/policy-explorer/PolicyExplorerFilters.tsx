import { Button, Grid, Typography } from "@material-ui/core";
import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import i18n from "../../../locales";
import { PolicyExplorerFiltersState } from "../../pages/policy-explorer/PolicyExplorerState";
import { CountrySelector } from "../country-selector/CountrySelector";
import { DropdownMultiple } from "../dropdown/DropdownMultiple";
import { CategorySelector } from "./category-selector/CategorySelector";
import { useHistory, useLocation } from "react-router-dom";
import {
    CATEGORY_BY_TYPE_OF_HEALTHCARE,
    CHANGES_IN_COVERAGE_POLICY_CATEGORY_ID,
} from "../../../data/repositories/policy-explorer/PolicyExplorerCategoryD2Repository";

const CATEGORIES_NOT_SHOW_SUBCATEGORIES = [
    CHANGES_IN_COVERAGE_POLICY_CATEGORY_ID.UP_TO_AND_INCLUDING_2019,
    CHANGES_IN_COVERAGE_POLICY_CATEGORY_ID.SINCE_2020,
    CATEGORY_BY_TYPE_OF_HEALTHCARE.USER_CHARGES,
];

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

    const moreThanOneCountrySelected = useMemo(() => {
        return !!filters.country.selected?.length && filters.country.selected?.length > 1;
    }, [filters.country.selected?.length]);

    return (
        <Grid container spacing={5} alignItems="flex-end" justifyContent="center">
            <Grid item md={4} sm={6}>
                <Center>
                    <CategorySelector
                        fullWidth
                        moreThanOneCountrySelected={moreThanOneCountrySelected}
                        label={i18n.t("Category")}
                        placeholder={i18n.t("Select category")}
                        categoryOptions={filters.category.options}
                        selectedCategoriesWithSubcategories={filters.category.selected}
                        onSelect={onCategoryChange}
                        disabledCategories={filters.category.disabledCategories}
                        categoriesNotShowSubcategories={CATEGORIES_NOT_SHOW_SUBCATEGORIES}
                    />
                </Center>
            </Grid>
            <Grid item md={4} sm={6}>
                <Center>
                    <CountrySelector
                        fullWidth
                        hasClearAll
                        hasSelectAll={filters.country.allowSelectAllCountries}
                        label={i18n.t("Countries")}
                        countries={filters.country.options}
                        selectedIds={filters.country.selected}
                        onSelectedIdsChange={onCountryChange}
                        disabledCountries={filters.country.disabledCountries}
                    />
                </Center>
            </Grid>
            <Grid item md={3} sm={6}>
                <Center>
                    <DropdownMultiple
                        fullWidth
                        label={i18n.t("Year")}
                        placeholder={i18n.t("Select year")}
                        options={filters.year.options}
                        values={filters.year.selected}
                        onChange={onYearsChange}
                        disabled
                    />
                </Center>
            </Grid>
            <Grid item md={1} sm={2}>
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
            </Grid>
        </Grid>
    );
});

const Center = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const GetTableButton = styled(Button)`
    border-radius: 20px;
    height: 50px;
    text-transform: none;
    white-space: nowrap;
`;
