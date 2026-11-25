import { Grid, Typography } from "@material-ui/core";
import React from "react";
import i18n from "../../../locales";
import { PolicyExplorerFiltersState } from "../../pages/policy-explorer/PolicyExplorerState";
import { TreeSelector } from "../tree-selector/TreeSelector";
import { DropdownMultiple } from "../dropdown/DropdownMultiple";
import { CategorySelector } from "./category-selector/CategorySelector";
import { usePolicyExplorerFilters } from "./category-selector/usePolicyExplorerFilters";
import { FilterContainer, GetResultsButton, GetResultsButtonGridItem } from "../explorer-filters/ExplorerFiltersStyles";

export interface PolicyExplorerFiltersProps {
    filters: PolicyExplorerFiltersState;
    onGetTable: () => void;
    disableGet?: boolean;
}

export const PolicyExplorerFilters: React.FC<PolicyExplorerFiltersProps> = React.memo(
    ({ filters, onGetTable, disableGet = false }) => {
        const { onCategoryChange, onCountryChange, onYearsChange, isMobile } = usePolicyExplorerFilters({ filters });
        return (
            <Grid container spacing={isMobile ? 2 : 5} alignItems="flex-end" justifyContent="center" wrap="wrap">
                <Grid item md sm={6} xs={12}>
                    <FilterContainer>
                        <CategorySelector
                            fullWidth
                            label={i18n.t("Categories")}
                            placeholder={i18n.t("Select category")}
                            categoryOptions={filters.category.options}
                            selectedCategoriesWithSubcategories={filters.category.selected}
                            onSelect={onCategoryChange}
                            fullScreen={isMobile}
                        />
                    </FilterContainer>
                </Grid>
                <Grid item md sm={6} xs={12}>
                    <FilterContainer>
                        <TreeSelector
                            fullWidth
                            hasClearAll
                            hasSelectAll
                            label={i18n.t("Countries and areas")}
                            items={filters.country.options}
                            selectedIds={filters.country.selected}
                            onSelectedIdsChange={onCountryChange}
                            placeholder={i18n.t("Select country or area")}
                            disabledItems={filters.country.disabledCountries}
                            showSubChildren={filters.country.showSubRegions}
                            defaultExpanded={filters.country.defaultExpandedCountries}
                            showParentIfChecked={true}
                            showOnlyAllParentSelectedIfChecked={true}
                            allSelectedLabel={i18n.t("All countries/areas")}
                            parentSort={filters.country.parentSort}
                            fullScreen={isMobile}
                        />
                    </FilterContainer>
                </Grid>
                <Grid item md sm={6} xs={12}>
                    <FilterContainer>
                        <DropdownMultiple
                            fullWidth
                            label={i18n.t("Years")}
                            placeholder={i18n.t("Select year")}
                            options={filters.year.options}
                            values={filters.year.selected}
                            onChange={onYearsChange}
                            fullScreen={isMobile}
                        />
                    </FilterContainer>
                </Grid>
                <GetResultsButtonGridItem item md="auto" sm={6} xs={12}>
                    <GetResultsButton
                        aria-label="Get table"
                        variant="contained"
                        color="primary"
                        disabled={
                            disableGet ||
                            !filters.category.selected ||
                            !Object.keys(filters.category.selected)?.length ||
                            !filters.country.selected?.length ||
                            !filters.year.selected?.length
                        }
                        onClick={onGetTable}
                        $isMobile={isMobile}
                    >
                        <Typography>{i18n.t("Get table")}</Typography>
                    </GetResultsButton>
                </GetResultsButtonGridItem>
            </Grid>
        );
    }
);
