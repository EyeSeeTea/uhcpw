import { Button, Grid, Typography, useMediaQuery, useTheme } from "@material-ui/core";
import React, { useCallback, useMemo } from "react";
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
import { formatCountryOrRegionParamName, joinCountries } from "../../../utils/formatCountryOrRegionParamName";
import {
    findThemeFromParam,
    formatResourcesThemeParamName,
    getParamFromThemes,
} from "../../../utils/formatResourcesThemeParamName";
import { useAppContext } from "../../../contexts/app-context";

export interface ResourcesFiltersProps {
    filters: ResourcesFiltersState;
    onGetResources: () => void;
    disabledCountryFilter?: boolean;
    disabledYearFilter?: boolean;
    disabledThemeFilter?: boolean;
    isAllResourcesPage?: boolean;
}

export const ResourcesFilters: React.FC<ResourcesFiltersProps> = React.memo(
    ({
        filters,
        onGetResources,
        disabledCountryFilter,
        disabledYearFilter,
        disabledThemeFilter,
        isAllResourcesPage,
    }) => {
        const theme = useTheme();
        const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
        const history = useHistory();
        const location = useLocation();
        const { themes } = useAppContext();

        const onCategoryChange = useCallback(
            (value: string | undefined) => {
                const themeParam = filters.theme.selected
                    ? getParamFromThemes(themes, filters.theme.selected)
                    : undefined;

                if (themeParam && value) {
                    history.push(`/resources/${value}/${themeParam}`);
                } else {
                    history.push(`/resources${value ? `/${value}` : ""}`);
                }
            },
            [filters.theme.selected, history, themes]
        );

        const { baseParams, themeParam, countriesParam } = useMemo(() => {
            const pathParts = location.pathname.split("/").filter(Boolean);

            if (isAllResourcesPage) {
                //  ["resources", :theme?]
                const themePart = pathParts[1];

                return {
                    baseParams: pathParts.slice(0, 1), // ["resources"]
                    themeParam: themePart,
                    countriesParam: undefined,
                };
            } else {
                // ["resources", :category, :countriesOrTheme?, :countries?]

                const countriesOrThemePart = pathParts[2];
                const countrysPart = pathParts[3];
                return {
                    baseParams: pathParts.slice(0, 2), // ["resources", category]
                    themeParam:
                        countriesOrThemePart && findThemeFromParam(themes, countriesOrThemePart)
                            ? countriesOrThemePart
                            : undefined,
                    countriesParam:
                        countriesOrThemePart && !findThemeFromParam(themes, countriesOrThemePart)
                            ? countriesOrThemePart
                            : countrysPart,
                };
            }
        }, [location.pathname, isAllResourcesPage, themes]);

        const onCountryChange = useCallback(
            (value: string[] | undefined) => {
                const newCountryNamesInParams = filters.country.options
                    .filter(country => value?.includes(country.id))
                    .map(country => formatCountryOrRegionParamName(country.name));

                const newCountryNamesParams =
                    newCountryNamesInParams.length > 0 ? joinCountries(newCountryNamesInParams) : undefined;

                const nextPath = [
                    ...baseParams,
                    ...(themeParam ? [themeParam] : []),
                    ...(newCountryNamesParams ? [newCountryNamesParams] : []),
                ].join("/");

                history.replace(`/${nextPath}`);
                filters.country.onSelectedChange(value);
            },
            [baseParams, filters.country, history, themeParam]
        );

        const onThemeChange = useCallback(
            (value: string | undefined) => {
                const newTheme = themes.find(theme => value && theme.name === value)?.displayedName;

                const nextPath = [
                    ...baseParams,
                    ...(newTheme ? [formatResourcesThemeParamName(newTheme)] : []),
                    ...(countriesParam ? [countriesParam] : []),
                ].join("/");

                history.replace(`/${nextPath}`);
                filters.theme.onSelectedChange(value);
            },
            [baseParams, countriesParam, filters.theme, history, themes]
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
