import { Backdrop, CircularProgress, Container, Grid, Typography } from "@material-ui/core";
import React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { Resource } from "../../../../domain/entities/resources/Resource";
import { Layout } from "../../../components/layout/Layout";
import { ComparativeAnalysisItem } from "../../../components/resources/comparative-analysis/ComparativeAnalysisItem";
import { ResourcesFilters } from "../../../components/resources/resources-filters/ResourcesFilters";
import SearchInput from "../../../components/search-input/SearchInput";
import { colors } from "../../app/themes/dhis2.theme";
import { useResourcesByType } from "./useResourcesByType";

export const ResourcesByTypePage: React.FC = React.memo(() => {
    const { category } = useParams<{ category: string }>();
    const { loading, title, filters, items } = useResourcesByType(category);

    return (
        <Layout>
            <TitleContainer>
                <Typography variant="h4">{title}</Typography>
            </TitleContainer>
            <SearchContainer>
                <SearchInput value={filters.searchTerm} onChange={filters.onSearchTermChange} />
            </SearchContainer>
            <Content>
                <SelectsContainer maxWidth="xl">
                    <ResourcesFilters filters={filters} />
                </SelectsContainer>
                <Container maxWidth="xl">
                    <Grid container spacing={5}>
                        {items.map((item, index) => {
                            return (
                                <Grid key={index} item lg={2} md={3} xs={6}>
                                    <Item resource={item} />
                                </Grid>
                            );
                        })}
                    </Grid>
                </Container>

                <Backdrop open={loading} style={{ color: "#fff", zIndex: 1 }}>
                    <CircularProgress color="primary" />
                </Backdrop>
            </Content>
        </Layout>
    );
});

const Item: React.FC<{ resource: Resource }> = React.memo(({ resource }) => {
    switch (resource.kind) {
        case "comparative-analysis":
            return <ComparativeAnalysisItem comparativeAnalysis={resource} />;
        case "country-analysis":
            return <div></div>;
        case "news":
            return <div></div>;
        case "multimedia":
            return <div></div>;
    }
});

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

const SelectsContainer = styled(Container)`
    padding-top: 64px;
    padding-bottom: 32px;
`;

const SearchContainer = styled.div`
    margin: -24px;
    display: flex;
    flex-direction: row;
    justify-content: center;
`;
