import { Container, Grid, Tooltip, Typography } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import i18n from "../../../../locales";
import { Layout } from "../../../components/layout/Layout";
import { ComparativeAnalysisItem } from "../../../components/resources/comparative-analysis/ComparativeAnalysisItem";
import { SimpleResourceItem } from "../../../components/resources/common/SimpleResourceItem";
import { ResourceGroup } from "../../../components/resources/resource-group/ResourceGroup";
import { ResourcesFilters } from "../../../components/resources/resources-filters/ResourcesFilters";
import { colors } from "../../app/themes/dhis2.theme";
import { useResources } from "./useResources";
import SearchInput from "../../../components/search-input/SearchInput";

export const ResourcesPage: React.FC = React.memo(() => {
    const history = useHistory();
    const { filters, resources, onGetResources } = useResources();

    return (
        <Layout>
            <TitleContainer>
                <Typography variant="h4">{i18n.t("Resources")}</Typography>
            </TitleContainer>
            <SearchContainer>
                <SearchInput value={filters.search.term} onChange={filters.search.onTermChange} />
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

                    {resources && (
                        <>
                            <Grid item md={filters.search.term ? 12 : 6} xs={12}>
                                {resources.countryAnalysisByCountry.length > 0 && (
                                    <ResourceGroup
                                        title={i18n.t("Country analysis")}
                                        seeAllUrl={"/resources/country-analysis"}
                                    >
                                        {resources.countryAnalysisByCountry.map(country => {
                                            return (
                                                <Grid item xs={2} key={country.countryId}>
                                                    <Tooltip title={country.countryName} placement="top" arrow>
                                                        <Flag
                                                            role="listitem"
                                                            width={"90%"}
                                                            src={country.flag}
                                                            onClick={() =>
                                                                history.push(
                                                                    `/resources/country-analysis?country=${country.countryId}`
                                                                )
                                                            }
                                                        />
                                                    </Tooltip>
                                                </Grid>
                                            );
                                        })}
                                    </ResourceGroup>
                                )}
                            </Grid>
                            <Grid item md={filters.search.term ? 12 : 6} xs={12}>
                                {resources.comparativeAnalysis.length > 0 && (
                                    <ResourceGroup
                                        title={i18n.t("Comparative analysis")}
                                        seeAllUrl={"/resources/comparative-analysis"}
                                    >
                                        {resources.comparativeAnalysis.map(comparativeItem => {
                                            return (
                                                <Grid item key={comparativeItem.id}>
                                                    <ComparativeAnalysisItem
                                                        comparativeAnalysis={comparativeItem}
                                                        minimalVersion
                                                    />
                                                </Grid>
                                            );
                                        })}
                                    </ResourceGroup>
                                )}
                            </Grid>
                            <Grid item md={filters.search.term ? 12 : 6} xs={12}>
                                {resources.multimedia.length > 0 && (
                                    <ResourceGroup title={i18n.t("Multimedia")} seeAllUrl={"/resources/multimedia"}>
                                        {resources.multimedia.map(multimediaItem => {
                                            return (
                                                <Grid item xs={12} key={multimediaItem.id}>
                                                    <SimpleResourceItem
                                                        title={multimediaItem.title}
                                                        url={multimediaItem.url}
                                                        image={multimediaItem.image}
                                                        date={multimediaItem.date}
                                                    />
                                                </Grid>
                                            );
                                        })}
                                    </ResourceGroup>
                                )}
                            </Grid>
                            <Grid item md={filters.search.term ? 12 : 6} xs={12}>
                                {resources.news.length > 0 && (
                                    <ResourceGroup title={i18n.t("News")} seeAllUrl={"/resources/news"}>
                                        {resources.news.map(newsItem => {
                                            return (
                                                <Grid item xs={12} key={newsItem.id}>
                                                    <SimpleResourceItem
                                                        title={newsItem.title}
                                                        url={newsItem.url}
                                                        image={newsItem.image}
                                                        date={newsItem.date}
                                                    />
                                                </Grid>
                                            );
                                        })}
                                    </ResourceGroup>
                                )}
                            </Grid>
                        </>
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
    padding-top: 64px;
    padding-bottom: 32px;
`;

const Flag = styled.img`
    border: 1px solid #c5c3c3;
    margin: 16px;
    cursor: pointer;
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
