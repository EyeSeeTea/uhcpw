import { Grid, Typography, useMediaQuery, useTheme } from "@material-ui/core";
import React from "react";

import i18n from "../../../locales";
import { IndicatorExplorerFiltersState } from "../../pages/indicator-explorer/IndicatorExplorerState";
import { TreeSelector } from "../tree-selector/TreeSelector";
import { IndicatorTreeSelector } from "./category-indicator-selector/tree/IndicatorTreeSelector";
import { FilterContainer, GetResultsButton, GetResultsButtonGridItem } from "../explorer-filters/ExplorerFiltersStyles";

export interface IndicatorExplorerFiltersProps {
    filters: IndicatorExplorerFiltersState;
    onGetChart: () => void;
    disableGet?: boolean;
}

export const IndicatorExplorerFilters: React.FC<IndicatorExplorerFiltersProps> = React.memo(
    ({ filters, onGetChart, disableGet }) => {
        const theme = useTheme();
        const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
        return (
            <Grid container spacing={isMobile ? 2 : 5} alignItems="flex-end" justifyContent="center" wrap="wrap">
                <Grid item md sm={6} xs={12}>
                    <FilterContainer>
                        <IndicatorTreeSelector
                            fullWidth
                            label={i18n.t("Indicators")}
                            placeholder={i18n.t("Select category and indicator")}
                            options={filters.indicators.options}
                            selectedValue={filters.indicators.selected}
                            onChange={filters.indicators.onSelectedChange}
                            fullScreen={isMobile}
                        />
                    </FilterContainer>
                </Grid>
                <Grid item md sm={6} xs={12}>
                    <FilterContainer>
                        <TreeSelector
                            fullWidth
                            hasSelectAll={!filters.countryAndRegions.isOnlyEu27Comparison}
                            hasClearAll
                            label={i18n.t("Countries and areas")}
                            items={filters.countryAndRegions.options}
                            selectedIds={filters.countryAndRegions.selected}
                            onSelectedIdsChange={filters.countryAndRegions.onSelectedChange}
                            disabledItems={filters.countryAndRegions.disabledCountriesAndRegions}
                            maxSelection={filters.countryAndRegions.maxCountrySelection}
                            showSubChildren={filters.countryAndRegions.showSubRegions}
                            placeholder={i18n.t("Select country or area")}
                            showParentIfChecked={!filters.countryAndRegions.isOnlyEu27Comparison}
                            showOnlyAllParentSelectedIfChecked={!filters.countryAndRegions.isOnlyEu27Comparison}
                            selectedItemsToShowWhenAllSelected={
                                filters.countryAndRegions.selectedItemsToShowWhenAllSelected
                            }
                            allSelectedLabel={i18n.t("All countries/areas")}
                            parentSort={filters.countryAndRegions.parentSort}
                            fullScreen={isMobile}
                        />
                    </FilterContainer>
                </Grid>
                <Grid item md sm={6} xs={12}>
                    <FilterContainer>
                        <TreeSelector
                            fullWidth
                            hasClearAll
                            label={i18n.t("Years")}
                            items={filters.year.options}
                            selectedIds={filters.year.selected}
                            onSelectedIdsChange={filters.year.onSelectedChange}
                            disabledItems={filters.year.disabledYears}
                            placeholder={i18n.t("Select year")}
                            disableSearch={!isMobile}
                            showParentIfChecked={true}
                            hasSelectAll={!filters.year.isSingleSelection}
                            closeOnSelect={filters.year.isSingleSelection}
                            fullScreen={isMobile}
                        />
                    </FilterContainer>
                </Grid>
                <GetResultsButtonGridItem item md="auto" sm={6} xs={12}>
                    <GetResultsButton
                        aria-label="Get chart"
                        variant="contained"
                        color="primary"
                        disabled={
                            disableGet ||
                            !filters.indicators.selected ||
                            !filters.countryAndRegions.selected?.length ||
                            !filters.year.selected?.length
                        }
                        onClick={onGetChart}
                        $isMobile={isMobile}
                    >
                        <Typography>{i18n.t("Get chart")}</Typography>
                    </GetResultsButton>
                </GetResultsButtonGridItem>
            </Grid>
        );
    }
);
