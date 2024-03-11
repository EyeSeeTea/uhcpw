import { Button, Grid, Typography } from "@material-ui/core";
import React, { useCallback } from "react";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
import i18n from "../../../../locales";
import { ResourcesFiltersState } from "../../../pages/resources/common/ResourcesFiltersState";
import { CountrySelector } from "../../country-selector/CountrySelector";
import { Dropdown } from "../../dropdown/Dropdown";
import { DropdownMultiple } from "../../dropdown/DropdownMultiple";

export interface ResourcesFiltersProps {
    filters: ResourcesFiltersState;
    onGetResources: () => void;
    disabledCountryFilter?: boolean;
    disabledYearFilter?: boolean;
    disabledThemeFilter?: boolean;
}

export const ResourcesFilters: React.FC<ResourcesFiltersProps> = React.memo(
    ({ filters, onGetResources, disabledCountryFilter, disabledYearFilter, disabledThemeFilter }) => {
        const history = useHistory();
        const location = useLocation();
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

        const onCountryChange = useCallback(
            (value: string[] | undefined) => {
                const queryParameters = new URLSearchParams(location.search);

                if (value && value.length > 0) {
                    queryParameters.set("country", value?.join(","));
                } else {
                    queryParameters.delete("country");
                }

                history.replace({ search: queryParameters.toString() });
            },
            [history, location.search]
        );

        const onThemeChange = useCallback(
            (value: string | undefined) => {
                const queryParameters = new URLSearchParams(location.search);

                if (value) {
                    queryParameters.set("theme", value);
                } else {
                    queryParameters.delete("theme");
                }

                history.replace({ search: queryParameters.toString() });
            },
            [history, location.search]
        );

        return (
            <Grid container spacing={1} alignItems="flex-end" justifyContent="space-between">
                <Grid item md={2} sm={6}>
                    <Center>
                        <Dropdown
                            fullWidth
                            placeholder={i18n.t("Select category")}
                            options={filters.category.options}
                            value={filters.category.selected}
                            onChange={onCategoryChange}
                            label={i18n.t("Select category")}
                            hideLabel
                        />
                    </Center>
                </Grid>
                <Grid item md={2} sm={6}>
                    <Center>
                        <Dropdown
                            fullWidth
                            placeholder={i18n.t("Select theme")}
                            options={filters.theme.options}
                            value={filters.theme.selected}
                            onChange={onThemeChange}
                            disabled={disabledThemeFilter}
                            label={i18n.t("Select theme")}
                            hideLabel
                        />
                    </Center>
                </Grid>
                <Grid item md={2} sm={6}>
                    <Center>
                        <CountrySelector
                            fullWidth
                            placeholder={i18n.t("Select country")}
                            countries={filters.country.options}
                            selectedIds={filters.country.selected}
                            disabled={disabledCountryFilter}
                            onSelectedIdsChange={onCountryChange}
                        />
                    </Center>
                </Grid>
                <Grid item md={2} sm={6}>
                    <Center>
                        <DropdownMultiple
                            placeholder={i18n.t("Select years")}
                            options={filters.year.options}
                            values={filters.year.selected}
                            onChange={filters.year.onSelectedChange}
                            disabled={disabledYearFilter}
                            label={i18n.t("Select years")}
                            hideLabel
                        />
                    </Center>
                </Grid>
                <Grid item md={1} sm={2} xs={6}>
                    <SearchButton aria-label="Search" variant="contained" color="primary" onClick={onGetResources}>
                        <Typography>{i18n.t("Search")}</Typography>
                    </SearchButton>
                </Grid>
            </Grid>
        );
    }
);

const Center = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const SearchButton = styled(Button)`
    border-radius: 20px;
    height: 50px;
    text-transform: none;
    padding: 16px 24px;
`;
