import { Button, Grid } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import i18n from "../../../locales";
import { IndicatorExplorerFiltersState } from "../../pages/indicator-explorer/IndicatorExplorerState";
import { CountrySelector } from "../country-selector/CountrySelector";
import { Dropdown } from "../dropdown/Dropdown";
import { DropdownMultiple } from "../dropdown/DropdownMultiple";

export interface ResourcesFiltersProps {
    filters: IndicatorExplorerFiltersState;
    onGetChart: () => void;
}

export const IndicatorExplorerFilters: React.FC<ResourcesFiltersProps> = React.memo(({ filters, onGetChart }) => {
    return (
        <Grid container spacing={5} alignItems="flex-end" justifyContent="center">
            <Grid item md={4} xs={6}>
                <Center>
                    <Dropdown
                        fullWidth
                        label={i18n.t("Category and indicator")}
                        placeholder={i18n.t("Select category")}
                        options={filters.category.options}
                        value={filters.category.selected}
                        onChange={filters.category.onSelectedChange}
                    />
                </Center>
            </Grid>
            <Grid item md={4} xs={6}>
                <Center>
                    <CountrySelector
                        countries={filters.country.options}
                        selectedIds={filters.country.selected}
                        onSelectedIdsChange={filters.country.onSelectedChange}
                        groupedByIncome={filters.country.groupedByIncome}
                        onGroupedByIncomeChange={filters.country.onGroupedByIncomeChange}
                    />
                </Center>
            </Grid>
            <Grid item md={3} xs={6}>
                <Center>
                    <DropdownMultiple
                        fullWidth
                        label={i18n.t("Years")}
                        placeholder={i18n.t("Select years")}
                        options={filters.year.options}
                        values={filters.year.selected}
                        onChange={filters.year.onSelectedChange}
                    />
                </Center>
            </Grid>
            <Grid item md={1} xs={2}>
                <GetChartButton
                    aria-label="Get chart"
                    variant="contained"
                    color="primary"
                    disabled={
                        !filters.category.selected ||
                        !filters.country.selected?.length ||
                        !filters.year.selected?.length
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
