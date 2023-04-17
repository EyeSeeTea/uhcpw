import { Grid } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import i18n from "../../../locales";
import { PolicyExplorerFiltersState } from "../../pages/policy-explorer/PolicyExplorerState";
import { Dropdown } from "../dropdown/Dropdown";
import { DropdownMultiple } from "../dropdown/DropdownMultiple";

export interface ResourcesFiltersProps {
    filters: PolicyExplorerFiltersState;
}

export const PolicyExplorerFilters: React.FC<ResourcesFiltersProps> = React.memo(({ filters }) => {
    return (
        <Grid container spacing={5}>
            <Grid item md={5} xs={6}>
                <Center>
                    <Dropdown
                        fullWidth
                        label={i18n.t("Category")}
                        placeholder={i18n.t("Select category")}
                        options={filters.categoryFilters}
                        value={filters.selectedCategoryFilter}
                        onChange={filters.onChangeCategoryFilter}
                    />
                </Center>
            </Grid>
            <Grid item md={4} xs={6}>
                <Center>
                    <DropdownMultiple
                        fullWidth
                        label={i18n.t("Countries")}
                        placeholder={i18n.t("Select countries")}
                        options={filters.countryFilters}
                        values={filters.selectedCountryFilter}
                        onChange={filters.onChangeCountryFilter}
                    />
                </Center>
            </Grid>
            <Grid item md={3} xs={6}>
                <Center>
                    <Dropdown
                        fullWidth
                        label={i18n.t("Year")}
                        placeholder={i18n.t("Select year")}
                        options={filters.yearFilters}
                        value={filters.selectedYearFilter}
                        onChange={filters.onChangeYearFilter}
                    />
                </Center>
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
