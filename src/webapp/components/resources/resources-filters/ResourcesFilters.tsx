import { Grid } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import i18n from "../../../../locales";
import { ResourcesFiltersState } from "../../../pages/resources/ResourcesState";
import { SelectDropdown } from "../../select-dropdown/SelectDropdown";

export interface ResourcesFiltersProps {
    filters: ResourcesFiltersState;
}

export const ResourcesFilters: React.FC<ResourcesFiltersProps> = React.memo(({ filters }) => {
    return (
        <Grid container spacing={5}>
            <Grid item md={3} xs={6}>
                <Center>
                    <SelectDropdown
                        label={i18n.t("Category")}
                        items={filters.categoryFilters}
                        value={filters.selectedCategoryFilter}
                        onChange={filters.onChangeCategoryFilter}
                    />
                </Center>
            </Grid>
            <Grid item md={3} xs={6}>
                <Center>
                    <SelectDropdown
                        label={i18n.t("Theme")}
                        items={filters.themeFilters}
                        value={filters.selectedThemeFilter}
                        onChange={filters.onChangeThemeFilter}
                    />
                </Center>
            </Grid>
            <Grid item md={3} xs={6}>
                <Center>
                    <SelectDropdown
                        label={i18n.t("Countries")}
                        items={filters.countryFilters}
                        value={filters.selectedCountryFilter}
                        onChange={filters.onChangeCountryFilter}
                    />
                </Center>
            </Grid>
            <Grid item md={3} xs={6}>
                <Center>
                    <SelectDropdown
                        label={i18n.t("Year")}
                        items={filters.yearFilters}
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
