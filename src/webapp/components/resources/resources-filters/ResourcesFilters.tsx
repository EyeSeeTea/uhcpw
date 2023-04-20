import { Grid } from "@material-ui/core";
import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import i18n from "../../../../locales";
import { ResourcesFiltersState } from "../../../pages/resources/common/ResourcesFiltersState";
import { Dropdown } from "../../dropdown/Dropdown";

export interface ResourcesFiltersProps {
    filters: ResourcesFiltersState;
}

export const ResourcesFilters: React.FC<ResourcesFiltersProps> = React.memo(({ filters }) => {
    const history = useHistory();

    const onCategoryChange = useCallback(
        (value: string | undefined) => {
            if (value) {
                history.push(`/resources/${value}`);
            } else {
                history.push("/resources");
            }
        },
        [history]
    );

    return (
        <Grid container spacing={5}>
            <Grid item md={3} xs={6}>
                <Center>
                    <Dropdown
                        label={i18n.t("Category")}
                        placeholder={i18n.t("Select category")}
                        options={filters.categoryFilters}
                        value={filters.selectedCategoryFilter}
                        onChange={onCategoryChange}
                    />
                </Center>
            </Grid>
            <Grid item md={3} xs={6}>
                <Center>
                    <Dropdown
                        label={i18n.t("Theme")}
                        placeholder={i18n.t("Select theme")}
                        options={filters.themeFilters}
                        value={filters.selectedThemeFilter}
                        onChange={filters.onChangeThemeFilter}
                    />
                </Center>
            </Grid>
            <Grid item md={3} xs={6}>
                <Center>
                    <Dropdown
                        label={i18n.t("Countries")}
                        placeholder={i18n.t("Select countries")}
                        options={filters.countryFilters}
                        value={filters.selectedCountryFilter}
                        onChange={filters.onChangeCountryFilter}
                    />
                </Center>
            </Grid>
            <Grid item md={3} xs={6}>
                <Center>
                    <Dropdown
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
