import { Container, Grid, Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";

import i18n from "../../../../locales";
import { Layout } from "../../../components/layout/Layout";
import { ResourcesFilters } from "../../../components/resources/resources-filters/ResourcesFilters";
import { colors } from "../../app/themes/dhis2.theme";
import { useResources } from "./useResources";
import SearchInput from "../../../components/search-input/SearchInput";
import { FilteredByTextResources } from "./FilteredByTextResources";
import { LandingResources } from "./LandingResources";
import { useAnalytics } from "../../../common/hooks/analytics/useAnalytics";

export const ResourcesPage: React.FC = React.memo(() => {
    const { filters, landingResources, filteredByTextResources, onGetResources } = useResources();
    const { sendPageView } = useAnalytics();

    React.useEffect(() => {
        sendPageView({ title: "Resources" });
    }, [sendPageView]);

    return (
        <Layout>
            <TitleContainer>
                <Typography variant="h4">{i18n.t("Resources")}</Typography>
            </TitleContainer>
            <SearchContainer>
                <SearchInput
                    value={filters.search.term}
                    onChange={filters.search.onTermChange}
                    placeholder={i18n.t("Search all publications")}
                />
            </SearchContainer>
            <SelectsContainer maxWidth="xl">
                <Grid container>
                    <ResourcesFilters
                        filters={filters}
                        onGetResources={onGetResources}
                        disabledCountryFilter
                        disabledYearFilter
                        disabledThemeFilter
                    />

                    {!filters.search.term && !!landingResources && <LandingResources resources={landingResources} />}

                    {!!filters.search.term && !!filteredByTextResources && (
                        <FilteredByTextResources resources={filteredByTextResources} />
                    )}
                </Grid>
            </SelectsContainer>
        </Layout>
    );
});

const TitleContainer = styled.div`
    background: ${colors.gradientPrimary};
    color: white;
    padding: 32px 64px;
`;

const SelectsContainer = styled(Container)`
    padding-block-start: 64px;
    padding-block-end: 32px;
    padding-inline: 64px;
`;

const SearchContainer = styled.div`
    margin: -24px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    @media (max-width: 450px) {
        padding: 0 25px;
    }
`;
