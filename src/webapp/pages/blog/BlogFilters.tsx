import { Button, Grid, Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";

import { BlogFiltersState } from "./useBlogFilter";
import { DropdownMultiple } from "../../components/dropdown/DropdownMultiple";
import i18n from "../../../locales";

export interface BlogFiltersProps {
    filters: BlogFiltersState;
    onGetBlogData: () => void;
}

export const BlogFilters: React.FC<BlogFiltersProps> = React.memo(props => {
    const { filters, onGetBlogData } = props;

    return (
        <Grid container spacing={2} direction="row" alignItems="flex-end" justifyContent="flex-end">
            <Grid item md={2} sm={6}>
                <Center>
                    <DropdownMultiple
                        placeholder={filters.year.selected?.length === 0 ? i18n.t("Select years") : ""}
                        options={filters.year.options}
                        values={filters.year.selected}
                        onChange={filters.year.onSelectedChange}
                        label={i18n.t("Select years")}
                        hideLabel
                    />
                </Center>
            </Grid>
            <Grid item md={1} sm={3} xs={6}>
                <SearchButton aria-label="Search" variant="contained" color="primary" onClick={onGetBlogData}>
                    <Typography>{i18n.t("Search")}</Typography>
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
    width: 100%;
`;
