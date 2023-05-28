import { Container, Grid, Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import i18n from "../../../../locales";
import { Layout } from "../../../components/layout/Layout";
import { ComparativeAnalysis } from "../../../components/resources/comparative-analysis/ComparativeAnalysis";
import { CountryAnalysis } from "../../../components/resources/country-analysis/CountryAnalysis";
import { Multimedia } from "../../../components/resources/multimedia/Multimedia";
import { News } from "../../../components/resources/news/News";
import { ResourcesFilters } from "../../../components/resources/resources-filters/ResourcesFilters";
import SearchInput from "../../../components/search-input/SearchInput";
import { colors } from "../../app/themes/dhis2.theme";
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
            <SelectsContainer maxWidth="xl">
                <ResourcesFilters filters={filters} onGetResources={() => {}} />
            </SelectsContainer>
            <Grid container style={{ backgroundColor: "white" }}>
                <Grid item md={6} xs={12}>
                    <CountryAnalysisSection>
                        <Container maxWidth="xl">
                            <CountryAnalysis countryAnalysis={countryAnalysis} />
                        </Container>
                    </CountryAnalysisSection>
                </Grid>
                <Grid item md={6} xs={12}>
                    <ComparativeAnalysisSection>
                        <Container maxWidth="xl">
                            <ComparativeAnalysis comparativeAnalysis={comparativeAnalysis} />
                        </Container>
                    </ComparativeAnalysisSection>
                </Grid>
                <Grid item md={6} xs={12}>
                    <MultimediaSection>
                        <Container maxWidth="xl">
                            <Multimedia multimediaItems={multimedia} />
                        </Container>
                    </MultimediaSection>
                </Grid>
                <Grid item md={6} xs={12}>
                    <NewsSection>
                        <Container maxWidth="xl">
                            <News newsItems={news} />
                        </Container>
                    </NewsSection>
                </Grid>
            </Grid>
        </Layout>
    );
});

const CountryAnalysisSection = styled.div`
    padding-bottom: 64px;
`;

const ComparativeAnalysisSection = styled.div`
    padding-bottom: 64px;
`;

const NewsSection = styled.div`
    padding-bottom: 64px;
`;

const MultimediaSection = styled.div`
    padding-bottom: 64px;
`;

const TitleContainer = styled.div`
    background: ${colors.gradientPrimary};
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
