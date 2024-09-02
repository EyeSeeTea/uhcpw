import { Button, Grid, Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import i18n from "../../../locales";
import { IndicatorExplorerFiltersState } from "../../pages/indicator-explorer/IndicatorExplorerState";
import { TreeSelector } from "../tree-selector/TreeSelector";
import { IndicatorSelector } from "./category-indicator-selector/IndicatorSelector";

export interface ResourcesFiltersProps {
    filters: IndicatorExplorerFiltersState;
    onGetChart: () => void;
}

export const IndicatorExplorerFilters: React.FC<ResourcesFiltersProps> = React.memo(({ filters, onGetChart }) => {
    return (
        <Grid container alignItems="flex-end" justifyContent="center">
            <Grid item md={4} sm={6}>
                <Center>
                    <IndicatorSelector
                        fullWidth
                        label={i18n.t("Indicators")}
                        placeholder={i18n.t("Select category and indicator")}
                        options={filters.indicators.options}
                        selectedValue={filters.indicators.selected}
                        onChange={filters.indicators.onSelectedChange}
                    />
                </Center>
            </Grid>
            <Grid item md={4} sm={6}>
                <Center>
                    <TreeSelector
                        fullWidth
                        hasSelectAll={!filters.country.isOnlyEu27Comparison}
                        hasClearAll
                        label={i18n.t("Countries and areas")}
                        items={filters.country.options}
                        selectedIds={filters.country.selected}
                        onSelectedIdsChange={filters.country.onSelectedChange}
                        disabledItems={filters.country.disabledCountries}
                        maxSelection={filters.country.maxCountrySelection}
                        showSubChildren={filters.country.showSubRegions}
                        placeholder={i18n.t("Select country or area")}
                        showParentIfChecked={!filters.country.isOnlyEu27Comparison}
                        showOnlyAllParentSelectedIfChecked={!filters.country.isOnlyEu27Comparison}
                        selectedItemsToShowWhenAllSelected={filters.country.selectedItemsToShowWhenAllSelected}
                        allSelectedLabel={i18n.t("All countries/areas")}
                    />
                </Center>
            </Grid>
            <Grid item md={3} sm={6}>
                <Center>
                    <TreeSelector
                        fullWidth
                        hasSelectAll
                        hasClearAll
                        label={i18n.t("Years")}
                        items={filters.year.options}
                        selectedIds={filters.year.selected}
                        onSelectedIdsChange={filters.year.onSelectedChange}
                        placeholder={i18n.t("Select year")}
                        disableSearch={true}
                        showParentIfChecked={true}
                    />
                </Center>
            </Grid>
            <GridGetChartButton item md={1} sm={2}>
                <GetChartButton
                    aria-label="Get chart"
                    variant="contained"
                    color="primary"
                    disabled={
                        !filters.indicators.selected ||
                        !filters.country.selected?.length ||
                        !filters.year.selected?.length
                    }
                    onClick={onGetChart}
                >
                    <Typography>{i18n.t("Get chart")}</Typography>
                </GetChartButton>
            </GridGetChartButton>
        </Grid>
    );
});

const Center = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding-inline-end: 40px;
`;

const GetChartButton = styled(Button)`
    border-radius: 20px;
    height: 50px;
    text-transform: none;
    white-space: nowrap;
    background: #185698;
`;

const GridGetChartButton = styled(Grid)`
    text-align: end;
`;
