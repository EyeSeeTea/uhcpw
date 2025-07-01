import { Button, Grid, Typography, useMediaQuery, useTheme } from "@material-ui/core";
import React, { useCallback } from "react";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
import i18n from "../../../../locales";
import { ResourcesFiltersState } from "../../../pages/resources/common/ResourcesFiltersState";
import { TreeSelector } from "../../tree-selector/TreeSelector";
import { Dropdown } from "../../dropdown/Dropdown";
import { DropdownMultiple } from "../../dropdown/DropdownMultiple";
import {
    BREAKPOINT_WIDTH_SMALL_SCREEN,
    BREAKPOINT_WIDTH_MOBILE_SCREEN,
} from "../../../common/hooks/screen/useIsSmallScreen";

export interface ResourcesFiltersProps {
    filters: ResourcesFiltersState;
    onGetResources: () => void;
    disabledCountryFilter?: boolean;
    disabledYearFilter?: boolean;
    disabledThemeFilter?: boolean;
}

export const ResourcesFilters: React.FC<ResourcesFiltersProps> = React.memo(
    ({ filters, onGetResources, disabledCountryFilter, disabledYearFilter, disabledThemeFilter }) => {
        const theme = useTheme();
        const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
        const history = useHistory();
        const location = useLocation();

        const onCategoryChange = useCallback(
            (value: string | undefined) => {
                const theme = filters.theme.selected;
                if (value) {
                    history.push(`/resources/${value}${theme ? `?theme=${theme}` : ""}`);
                } else {
                    history.push(`/resources${theme ? `?theme=${theme}` : ""}`);
                }
            },
            [filters.theme.selected, history]
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
                filters.theme.onSelectedChange(value);
            },
            [filters.theme, history, location.search]
        );

        return (
            <StyledGrid container spacing={2} direction="row" alignItems="flex-end" justifyContent="center" wrap="wrap">
                <Grid item md={3} sm={6} xs={12}>
                    <FilterContainer>
                        <Dropdown
                            fullWidth
                            placeholder={i18n.t("Select category")}
                            options={filters.category.options}
                            value={filters.category.selected}
                            onChange={onCategoryChange}
                            label={i18n.t("Select category")}
                            hideLabel
                            fullScreen={isMobile}
                        />
                    </FilterContainer>
                </Grid>
                <Grid item md={3} sm={6} xs={12}>
                    <FilterContainer>
                        <Dropdown
                            fullWidth
                            placeholder={i18n.t("Select theme")}
                            options={filters.theme.options}
                            value={filters.theme.selected}
                            onChange={onThemeChange}
                            disabled={disabledThemeFilter}
                            label={i18n.t("Select theme")}
                            hideLabel
                            fullScreen={isMobile}
                        />
                    </FilterContainer>
                </Grid>
                <Grid item md={3} sm={6} xs={12}>
                    <FilterContainer marginTop="16px">
                        <TreeSelector
                            fullWidth
                            hasSelectAll
                            hasClearAll
                            topClearAll={-35}
                            placeholder={i18n.t("Select country or area")}
                            items={filters.country.options}
                            selectedIds={filters.country.selected}
                            disabled={disabledCountryFilter}
                            onSelectedIdsChange={onCountryChange}
                            showParentIfChecked={true}
                            showOnlyAllParentSelectedIfChecked={true}
                            allSelectedLabel={i18n.t("All countries/areas")}
                            fullScreen={isMobile}
                            parentSort={filters.country.parentSort}
                        />
                    </FilterContainer>
                </Grid>
                <Grid item md={2} sm={6} xs={12}>
                    <FilterContainer>
                        <DropdownMultiple
                            placeholder={i18n.t("Select years")}
                            options={filters.year.options}
                            values={filters.year.selected}
                            onChange={filters.year.onSelectedChange}
                            disabled={disabledYearFilter}
                            label={i18n.t("Select years")}
                            hideLabel
                            fullWidth
                            minWidth="100%"
                            fullScreen={isMobile}
                        />
                    </FilterContainer>
                </Grid>
                <Grid item md={1} sm={6} xs={12}>
                    <SearchButton aria-label="Search" variant="contained" color="primary" onClick={onGetResources}>
                        <Typography>{i18n.t("Search")}</Typography>
                    </SearchButton>
                </Grid>
            </StyledGrid>
        );
    }
);

const StyledGrid = styled(Grid)`
    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        padding-block-start: 10px;
    }
`;

const FilterContainer = styled.div<{ marginTop?: string }>`
    width: 100%;
    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        margin-block-start: ${({ marginTop }) => marginTop || "16px"};
    }

    @media (max-width: ${BREAKPOINT_WIDTH_MOBILE_SCREEN}px) {
        margin-block-start: ${({ marginTop }) => marginTop || "12px"};
        .TreeSelector-container {
            margin-block-start: 25px;
        }

        .TreeSelector-clear-button {
            top: -30px;
        }

        .Dropdown-clear-button,
        .DropdownMultiple-clear-button {
            top: -18px;
        }
    }
`;

const SearchButton = styled(Button)`
    border-radius: 20px;
    height: 50px;
    text-transform: none;
    padding: 16px 24px;
    width: 100%;

    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        margin-block-start: 16px;
    }
`;
