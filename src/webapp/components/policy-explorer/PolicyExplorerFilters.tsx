import { Button, Grid } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import i18n from "../../../locales";
import { PolicyExplorerFiltersState } from "../../pages/policy-explorer/PolicyExplorerState";
import { CountrySelector } from "../country-selector/CountrySelector";
import { Dropdown } from "../dropdown/Dropdown";
import { DropdownMultiple } from "../dropdown/DropdownMultiple";

export interface ResourcesFiltersProps {
    filters: PolicyExplorerFiltersState;
    onGetTable: () => void;
}

export const PolicyExplorerFilters: React.FC<ResourcesFiltersProps> = React.memo(({ filters, onGetTable }) => {
    return (
        <Grid container spacing={5} alignItems="flex-end" justifyContent="center">
            <Grid item md={4} xs={6}>
                <Center>
                    <Dropdown
                        fullWidth
                        label={i18n.t("Category")}
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
                        fullWidth
                        label={i18n.t("Countries")}
                        countries={filters.country.options}
                        selectedIds={filters.country.selected}
                        onSelectedIdsChange={filters.country.onSelectedChange}
                    />
                </Center>
            </Grid>
            <Grid item md={3} xs={6}>
                <Center>
                    <DropdownMultiple
                        fullWidth
                        label={i18n.t("Year")}
                        placeholder={i18n.t("Select year")}
                        options={filters.year.options}
                        values={filters.year.selected}
                        onChange={filters.year.onSelectedChange}
                        disabled
                    />
                </Center>
            </Grid>
            <Grid item md={1} xs={2}>
                <GetTableButton
                    aria-label="Get table"
                    variant="contained"
                    color="primary"
                    disabled={
                        !filters.category.selected ||
                        !filters.country.selected?.length ||
                        !filters.year.selected?.length
                    }
                    onClick={onGetTable}
                >
                    {i18n.t("Get table")}
                </GetTableButton>
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

const GetTableButton = styled(Button)`
    border-radius: 20px;
    height: 50px;
    text-transform: none;
`;
