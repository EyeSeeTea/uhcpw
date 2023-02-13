import { Container, Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import i18n from "../../../locales";
import { Layout } from "../../components/layout/Layout";
import { ComparativeAnalysis } from "../../components/resources/comparative-analysis/ComparativeAnalysis";
import { CountryAnalysis } from "../../components/resources/country-analysis/CountryAnalysis";
import { Multimedia } from "../../components/resources/multimedia/Multimedia";
import { News } from "../../components/resources/news/News";
import { ResourcesFilters } from "../../components/resources/resources-filters/ResourcesFilters";
import SearchInput from "../../components/search-input/SearchInput";
import { colors } from "../app/themes/dhis2.theme";
import { useResources } from "./useResources";

export const ResourcesPage: React.FC = React.memo(() => {
    const { countryAnalysis, filters, comparativeAnalysis, news, multimedia } = useResources();

    return (
        <Layout>
            <TitleContainer>
                <Typography variant="h4">{i18n.t("Resources")}</Typography>
            </TitleContainer>
            <SearchContainer>
                <SearchInput value={""} />
            </SearchContainer>
            <CountryAnalysisSection>
                <SelectsContainer maxWidth="xl">
                    <ResourcesFilters filters={filters} />
                </SelectsContainer>
                <Container maxWidth="xl">
                    <CountryAnalysis countryAnalysis={countryAnalysis} />
                </Container>
            </CountryAnalysisSection>
            <GradientDividerBlue />
            <ComparativeAnalysisSection>
                <Container maxWidth="xl">
                    <ComparativeAnalysis comparativeAnalysis={comparativeAnalysis} />
                </Container>
            </ComparativeAnalysisSection>
            <NewsSection>
                <Container maxWidth="xl">
                    <News newsItems={news} />
                </Container>
            </NewsSection>

            <GradientDividerBlue />

            <MultimediaSection>
                <Container maxWidth="xl">
                    <Multimedia multimediaItems={multimedia} />
                </Container>
            </MultimediaSection>

            <GradientDividerOrange />
        </Layout>
    );
});

const CountryAnalysisSection = styled.div`
    background: white;
    padding-bottom: 64px;
`;

const ComparativeAnalysisSection = styled.div`
    background: ${colors.gradientPrimary2};
    padding-bottom: 64px;
`;

const NewsSection = styled.div`
    background: white;
    padding-bottom: 64px;
`;

const MultimediaSection = styled.div`
    background: ${colors.gradientPrimary2};
    padding-bottom: 64px;
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

const GradientDividerBlue = styled.div`
    background: linear-gradient(90deg, rgb(4, 96, 167) 0%, #cee1f0 100%);
    height: 20px;
`;

const GradientDividerOrange = styled.div`
    background: linear-gradient(90deg, rgb(255, 141, 78) 0%, rgb(255, 223, 190) 100%);
    height: 20px;
`;
