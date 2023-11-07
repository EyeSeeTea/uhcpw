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

export const ResourcesByTypePage: React.FC = React.memo(() => {
    const history = useHistory();
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

    return (
        <Layout>
            <TitleContainer>
                <Title variant="h4">{title}</Title>
            </TitleContainer>
            <SearchContainer>
                <SearchInput value={filters.search.term} onChange={filters.search.onTermChange} />
            </SearchContainer>
            <Content>
                <SelectsContainer maxWidth="xl">
                    <ResourcesFilters
                        filters={filters}
                        onGetResources={onGetResources}
                        disabledCountryFilter={disabledCountryFilter}
                    />
                </SelectsContainer>
                <Container maxWidth="xl">
                    {
                        <Grid container spacing={5}>
                            {items &&
                                items.map((item, index) => {
                                    const sizes = getSizes(item);

                                    return (
                                        <Grid key={index} item lg={sizes.lg} md={sizes.md} xs={sizes.xs}>
                                            <ResourceItem resource={item} />
                                        </Grid>
                                    );
                                })}
                        </Grid>
                    }
                </Container>

                <Backdrop open={loading} style={{ color: "#fff", zIndex: 1 }}>
                    <CircularProgress color="primary" />
                </Backdrop>
            </Content>
        </Layout>
    );
});

const getSizes = (resource: Resource): { lg: GridSize; md: GridSize; xs: GridSize } => {
    switch (resource.kind) {
        case "comparative-analysis":
            return { lg: 2, md: 3, xs: 6 };
        case "country-analysis":
            return { lg: 2, md: 3, xs: 6 };
        case "news":
            return { lg: 4, md: 6, xs: 12 };
        case "multimedia":
            return { lg: 4, md: 6, xs: 12 };
    }
};

const Content = styled.div`
    background: white;
    padding: 32px;
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
    padding-top: 64px;
    padding-bottom: 32px;
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
