import { Button, Grid, Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import i18n from "../../../locales";
import { PolicyExplorerFiltersState } from "../../pages/policy-explorer/PolicyExplorerState";
import { CountrySelector } from "../country-selector/CountrySelector";
import { DropdownMultiple } from "../dropdown/DropdownMultiple";
import { CategorySelector } from "./category-selector/CategorySelector";

export interface ResourcesFiltersProps {
    filters: PolicyExplorerFiltersState;
    onGetTable: () => void;
}

export const PolicyExplorerFilters: React.FC<ResourcesFiltersProps> = React.memo(({ filters, onGetTable }) => {
    return (
        <Grid container spacing={5} alignItems="flex-end" justifyContent="center">
            <Grid item md={4} sm={6}>
                <Center>
                    <CategorySelector
                        fullWidth
                        label={i18n.t("Category")}
                        placeholder={i18n.t("Select category")}
                        categoryOptions={filters.category.options}
                        selectedCategoriesWithSubcategories={filters.category.selected}
                        onSelect={filters.category.onSelectedChange}
                    />
                </Center>
            </Grid>
            <Grid item md={4} sm={6}>
                <Center>
                    <CountrySelector
                        fullWidth
                        label={i18n.t("Countries")}
                        countries={filters.country.options}
                        selectedIds={filters.country.selected}
                        onSelectedIdsChange={filters.country.onSelectedChange}
                        groupedByIncome={filters.country.groupedByIncome}
                        onGroupedByIncomeChange={filters.country.onGroupedByIncomeChange}
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
                        onChange={filters.year.onSelectedChange}
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
