import { Container, Grid, Typography } from "@material-ui/core";
import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { Resource } from "../../../../domain/entities/Resource";
import i18n from "../../../../locales";
import { Layout } from "../../../components/layout/Layout";
import { ComparativeAnalysisItem } from "../../../components/resources/comparative-analysis/ComparativeAnalysisItem";
import { ResourcesFilters } from "../../../components/resources/resources-filters/ResourcesFilters";
import SearchInput from "../../../components/search-input/SearchInput";
import { colors } from "../../app/themes/dhis2.theme";
import { ResourceTypeParam, useResourcesByType } from "./useResourcesByType";

export const ResourcesByTypePage: React.FC = React.memo(() => {
    const { type } = useParams<{ type: ResourceTypeParam }>();
    const { filters, items } = useResourcesByType(type);

    const title = useMemo(() => getTitle(type), [type]);

    return (
        <Layout>
            <TitleContainer>
                <Typography variant="h4">{title}</Typography>
            </TitleContainer>
            <SearchContainer>
                <SearchInput value={""} />
            </SearchContainer>
            <CountryAnalysisSection>
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
            </CountryAnalysisSection>
        </Layout>
    );
});

function getTitle(type: ResourceTypeParam): string {
    switch (type) {
        case "comparative-analysis":
            return i18n.t("Comparative Analysis");
        case "country-analysis":
            return i18n.t("Country Analysis");
        case "news":
            return i18n.t("News");
        case "multimedia":
            return i18n.t("Mutimedia");
    }
}

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

const CountryAnalysisSection = styled.div`
    background: white;
    padding: 32px;
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
