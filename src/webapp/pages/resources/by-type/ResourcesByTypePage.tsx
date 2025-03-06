import { Backdrop, CircularProgress, Container, Grid, GridSize, Typography } from "@material-ui/core";
import React, { useMemo } from "react";
import { useHistory, useParams } from "react-router-dom";
import styled from "styled-components";
import { Resource } from "../../../../domain/entities/resources/Resource";
import { Layout } from "../../../components/layout/Layout";
import { ResourcesFilters } from "../../../components/resources/resources-filters/ResourcesFilters";
import SearchInput from "../../../components/search-input/SearchInput";
import { colors } from "../../app/themes/dhis2.theme";
import { useResourcesByType } from "./useResourcesByType";
import { ResourceItem } from "../../../components/resources/common/ResourceItem";
import { useAnalytics } from "../../../common/hooks/analytics/useAnalytics";

export const ResourcesByTypePage: React.FC = React.memo(() => {
    const history = useHistory();
    const { sendEvent } = useAnalytics();
    const { category } = useParams<{ category: string }>();

    const filterInParams = useMemo(() => {
        const searchParams = new URLSearchParams(history.location.search);

        const country = searchParams.get("country");
        const theme = searchParams.get("theme");

        return {
            country: country ? country.split(",") : undefined,
            theme: theme ? theme : undefined,
        };
    }, [history.location.search]);

    const { loading, title, filters, items, onGetResources } = useResourcesByType({
        category,
        countriesFilter: filterInParams.country,
        themeFilter: filterInParams.theme,
    });

    const disabledCountryFilter = useMemo(() => {
        return category === "news" || category === "multimedia";
    }, [category]);

    React.useEffect(() => {
        sendEvent({ name: "resource_kind_page_view", pageTitle: "Resources", category: category });
    }, [sendEvent, category]);

    return (
        <Layout>
            <TitleAndSearchContainer>
                <TitleContainer>
                    <Title variant="h4">{title}</Title>
                </TitleContainer>
                <SearchContainer>
                    <SearchInput value={filters.search.term} onChange={filters.search.onTermChange} />
                </SearchContainer>
            </TitleAndSearchContainer>
            <Content>
                <SelectsContainer maxWidth="xl">
                    <ResourcesFilters
                        filters={filters}
                        onGetResources={onGetResources}
                        disabledCountryFilter={disabledCountryFilter}
                    />
                    {
                        <StyledGridContainer spacing={2} container direction="row">
                            {items &&
                                items.map((item, index) => {
                                    const sizes = getSizes(item);

                                    return (
                                        <Grid key={index} item lg={sizes.lg} md={sizes.md} sm={sizes.sm} xs={sizes.xs}>
                                            <ResourceItem resource={item} analyticsPageTitle="Resources" />
                                        </Grid>
                                    );
                                })}
                        </StyledGridContainer>
                    }
                </SelectsContainer>
                <Backdrop open={loading} style={{ color: "#fff", zIndex: 1 }}>
                    <CircularProgress color="primary" />
                </Backdrop>
            </Content>
        </Layout>
    );
});

const getSizes = (resource: Resource): { lg: GridSize; md: GridSize; sm: GridSize; xs: GridSize } => {
    switch (resource.kind) {
        case "comparative-analysis":
            return { lg: 2, md: 3, sm: 6, xs: 12 };
        case "country-analysis":
            return { lg: 2, md: 3, sm: 6, xs: 12 };
        case "news":
            return { lg: 4, md: 6, sm: 6, xs: 12 };
        case "multimedia":
            return { lg: 4, md: 6, sm: 6, xs: 12 };
    }
};

const Content = styled.div`
    background: white;
    min-height: 100vh;
`;

const TitleContainer = styled.div`
    background: ${colors.gradientPrimary};
    color: white;
    padding: 32px 64px;
`;

const Title = styled(Typography)`
    text-transform: lowercase;
    :first-letter {
        text-transform: uppercase;
    }
`;

const SelectsContainer = styled(Container)`
    padding-block-start: 64px;
    padding-block-end: 32px;
    padding-inline: 64px;
`;

const SearchContainer = styled.div`
    position: absolute;
    bottom: -30px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: row;
    justify-content: center;
    max-width: 70%;
    width: 442px;
`;

const StyledGridContainer = styled(Grid)`
    padding-block: 32px;
`;

const TitleAndSearchContainer = styled.div`
    position: relative;
    width: 100%;
`;
