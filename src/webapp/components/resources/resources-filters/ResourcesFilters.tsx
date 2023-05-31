import { Button, Grid } from "@material-ui/core";
import React, { useCallback } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import i18n from "../../../../locales";
import { ResourcesFiltersState } from "../../../pages/resources/common/ResourcesFiltersState";
import { CountrySelector } from "../../country-selector/CountrySelector";
import { Dropdown } from "../../dropdown/Dropdown";
import { DropdownMultiple } from "../../dropdown/DropdownMultiple";

export interface ResourcesFiltersProps {
    filters: ResourcesFiltersState;
    onGetResources: () => void;
}

export const ResourcesFilters: React.FC<ResourcesFiltersProps> = React.memo(({ filters, onGetResources }) => {
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
        <Grid container spacing={5} alignItems="flex-end" justifyContent="center">
            <Grid item md={3} xs={6}>
                <Center>
                    <Dropdown
                        fullWidth
                        placeholder={i18n.t("Select category")}
                        options={filters.category.options}
                        value={filters.category.selected}
                        onChange={onCategoryChange}
                    />
                </Center>
            </Grid>
            <Grid item md={2} xs={6}>
                <Center>
                    <Dropdown
                        fullWidth
                        placeholder={i18n.t("Select theme")}
                        options={filters.theme.options}
                        value={filters.theme.selected}
                        onChange={filters.theme.onSelectedChange}
                    />
                </Center>
            </Grid>
            <Grid item md={3} xs={6}>
                <Center>
                    <CountrySelector
                        fullWidth
                        placeholder={i18n.t("Select country")}
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
                        placeholder={i18n.t("Select years")}
                        options={filters.year.options}
                        values={filters.year.selected}
                        onChange={filters.year.onSelectedChange}
                    />
                </Center>
            </Grid>
            <Grid item md={1} xs={2}>
                <SearchButton
                    aria-label="Search"
                    variant="contained"
                    color="primary"
                    disabled={!filters.category.selected}
                    onClick={onGetResources}
                >
                    {i18n.t("Search")}
                </SearchButton>
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

const SearchButton = styled(Button)`
    border-radius: 20px;
    height: 50px;
    text-transform: none;
    padding: 16px 24px;
`;
