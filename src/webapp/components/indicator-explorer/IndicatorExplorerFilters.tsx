import { Button, Grid } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import i18n from "../../../locales";
import { IndicatorExplorerFiltersState } from "../../pages/indicator-explorer/IndicatorExplorerState";
import { CountryOption, CountrySelector } from "../country-selector/CountrySelector";
import { Dropdown } from "../dropdown/Dropdown";
import { DropdownMultiple } from "../dropdown/DropdownMultiple";

export interface ResourcesFiltersProps {
    filters: IndicatorExplorerFiltersState;
    onGetChart: () => void;
}

const countries: CountryOption[] = [
    {
        id: "DVnpk4xiXGJ",
        name: "Spain",
        parents: [
            { id: "1", name: "All countries" },
            { id: "2", name: "Europe" },
        ],
    },
    {
        id: "AVnpk4xiXGJ",
        name: "France",
        parents: [
            { id: "1", name: "All countries" },
            { id: "2", name: "Europe" },
        ],
    },
    {
        id: "BVnpk4xiXGJ",
        name: "China",
        parents: [
            { id: "1", name: "All countries" },
            { id: "3", name: "Asia" },
        ],
    },
];

export const IndicatorExplorerFilters: React.FC<ResourcesFiltersProps> = React.memo(({ filters, onGetChart }) => {
    return (
        <Grid container spacing={5} alignItems="flex-end" justifyContent="center">
            <Grid item md={4} xs={6}>
                <Center>
                    <Dropdown
                        fullWidth
                        label={i18n.t("Category and indicator")}
                        placeholder={i18n.t("Select category")}
                        options={filters.categoryFilters}
                        value={filters.selectedCategoryFilter}
                        onChange={filters.onChangeCategoryFilter}
                    />
                </Center>
            </Grid>
            <Grid item md={4} xs={6}>
                <Center>
                    <CountrySelector
                        countries={countries}
                        //fullWidth
                        //label={i18n.t("Countries")}
                        //placeholder={i18n.t("Select countries")}
                        //options={filters.countryFilters}
                        //values={filters.selectedCountryFilter}
                        //onChange={filters.onChangeCountryFilter}
                    />
                </Center>
            </Grid>
            <Grid item md={3} xs={6}>
                <Center>
                    <DropdownMultiple
                        fullWidth
                        label={i18n.t("Years")}
                        placeholder={i18n.t("Select years")}
                        options={filters.yearFilters}
                        values={filters.selectedYearFilter}
                        onChange={filters.onChangeYearFilter}
                    />
                </Center>
            </Grid>
            <Grid item md={1} xs={2}>
                <GetChartButton
                    variant="contained"
                    color="primary"
                    disabled={
                        !filters.selectedCategoryFilter ||
                        !filters.selectedCountryFilter?.length ||
                        !filters.selectedYearFilter?.length
                    }
                    onClick={onGetChart}
                >
                    {i18n.t("Get chart")}
                </GetChartButton>
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

const GetChartButton = styled(Button)`
    border-radius: 20px;
    height: 50px;
    text-transform: none;
`;
