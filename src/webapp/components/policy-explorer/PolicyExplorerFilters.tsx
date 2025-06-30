import { Button, Grid, Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import i18n from "../../../locales";
import { PolicyExplorerFiltersState } from "../../pages/policy-explorer/PolicyExplorerState";
import { TreeSelector } from "../tree-selector/TreeSelector";
import { DropdownMultiple } from "../dropdown/DropdownMultiple";
import { CategorySelector } from "./category-selector/CategorySelector";
import { usePolicyExplorerFilters } from "./category-selector/usePolicyExplorerFilters";

export interface ResourcesFiltersProps {
    filters: PolicyExplorerFiltersState;
    onGetTable: () => void;
    disableGet?: boolean;
}

export const PolicyExplorerFilters: React.FC<ResourcesFiltersProps> = React.memo(
    ({ filters, onGetTable, disableGet }) => {
        const { onCategoryChange, onCountryChange, onYearsChange, isMobile } = usePolicyExplorerFilters({ filters });
        return (
            <Grid container spacing={isMobile ? 2 : 5} alignItems="flex-end" justifyContent="center" wrap="wrap">
                <Grid item md={4} sm={6} xs={12}>
                    <Wrapper>
                        <CategorySelector
                            fullWidth
                            label={i18n.t("Categories")}
                            placeholder={i18n.t("Select category")}
                            categoryOptions={filters.category.options}
                            selectedCategoriesWithSubcategories={filters.category.selected}
                            onSelect={onCategoryChange}
                            fullScreen={isMobile}
                        />
                    </Wrapper>
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                    <Wrapper>
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
                    </Wrapper>
                </Grid>
                <Grid item md={3} sm={6} xs={12}>
                    <Wrapper>
                        <DropdownMultiple
                            fullWidth
                            label={i18n.t("Years")}
                            placeholder={i18n.t("Select year")}
                            options={filters.year.options}
                            values={filters.year.selected}
                            onChange={onYearsChange}
                            fullScreen={isMobile}
                        />
                    </Wrapper>
                </Grid>
                <GridGetTableButton item md={1} sm={6} xs={12}>
                    <GetTableButton
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
                    </GetTableButton>
                </GridGetTableButton>
            </Grid>
        );
    }
);

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const GetTableButton = styled(Button)<{ $isMobile: boolean }>`
    border-radius: 20px;
    height: 50px;
    text-transform: none;
    white-space: nowrap;
    background: #185698;
    width: ${({ $isMobile }) => ($isMobile ? "100%" : "auto")};
    margin-block-start: ${({ $isMobile }) => ($isMobile ? "10px" : "0")};
`;

const GridGetTableButton = styled(Grid)`
    text-align: end;
`;
