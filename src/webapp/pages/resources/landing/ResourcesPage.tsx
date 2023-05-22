import { Container, Grid, Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import i18n from "../../../../locales";
import { Layout } from "../../../components/layout/Layout";
import { ComparativeAnalysisItem } from "../../../components/resources/comparative-analysis/ComparativeAnalysisItem";
import { CountryAnalysis } from "../../../components/resources/country-analysis/CountryAnalysis";
import { Multimedia } from "../../../components/resources/multimedia/Multimedia";
import { News } from "../../../components/resources/news/News";
import { NewsItem } from "../../../components/resources/news/NewsItem";
import { ResourceGroup } from "../../../components/resources/resource-group/ResourceGroup";
import { ResourcesFilters } from "../../../components/resources/resources-filters/ResourcesFilters";
import SearchInput from "../../../components/search-input/SearchInput";
import { colors } from "../../app/themes/dhis2.theme";
import { useResources } from "./useResources";

export const ResourcesPage: React.FC = React.memo(() => {
    const { countryAnalysis, filters, comparativeAnalysis, news, multimedia, onGetResources } = useResources();

    return (
        <Layout>
            <TitleContainer>
                <Typography variant="h4">{i18n.t("Resources")}</Typography>
            </TitleContainer>
            <SearchContainer>
                <SearchInput value={""} />
            </SearchContainer>
            <SelectsContainer maxWidth="xl">
                <Grid container>
                    <ResourcesFilters filters={filters} onGetResources={onGetResources} />

                    <Grid item md={6} xs={12}>
                        <CountryAnalysis countryAnalysis={countryAnalysis} />
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <ResourceGroup
                            title={i18n.t("Comparative Analysis")}
                            seeAllUrl={"/resources/comparative-analysis"}
                        >
                            {comparativeAnalysis.map(comparativeItem => {
                                return (
                                    <Grid item xs={6} md={3} key={comparativeItem.id}>
                                        <ComparativeAnalysisItem comparativeAnalysis={comparativeItem} minimalVersion />
                                    </Grid>
                                );
                            })}
                        </ResourceGroup>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <ResourceGroup title={i18n.t("Multimedia")} seeAllUrl={"/resources/mutimedia"}>
                            {news.map(newsItem => {
                                return (
                                    <Grid item xs={12} key={newsItem.id}>
                                        <NewsItem news={newsItem} />
                                    </Grid>
                                );
                            })}
                        </ResourceGroup>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <ResourceGroup title={i18n.t("News")} seeAllUrl={"/resources/news"}>
                            {news.map(newsItem => {
                                return (
                                    <Grid item xs={12} key={newsItem.id}>
                                        <NewsItem news={newsItem} />
                                    </Grid>
                                );
                            })}
                        </ResourceGroup>
                    </Grid>
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
    padding-top: 64px;
    padding-bottom: 32px;
`;

const SearchContainer = styled.div`
    margin: -24px;
    display: flex;
    flex-direction: row;
    justify-content: center;
`;
