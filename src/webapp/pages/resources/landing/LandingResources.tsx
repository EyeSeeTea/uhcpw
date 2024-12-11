import React from "react";
import { Grid, Tooltip } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

import i18n from "../../../../locales";
import { ComparativeAnalysisItem } from "../../../components/resources/comparative-analysis/ComparativeAnalysisItem";
import { SimpleResourceItem } from "../../../components/resources/common/SimpleResourceItem";
import { ResourceGroup } from "../../../components/resources/resource-group/ResourceGroup";
import { LandingResourcesState } from "./ResourcesState";
import { useAnalytics } from "../../../common/hooks/analytics/useAnalytics";

export const LandingResources: React.FC<{ resources: LandingResourcesState }> = React.memo(({ resources }) => {
    const history = useHistory();
    const { redirectWithEvent } = useAnalytics();

    return (
        <>
            <Grid item md={6} xs={12}>
                {resources.countryAnalysisByCountry.length > 0 && (
                    <ResourceGroup title={i18n.t("Country analysis")} seeAllUrl={"/resources/country-analysis"}>
                        {resources.countryAnalysisByCountry.map(country => {
                            return (
                                <Grid item xs={2} key={country.countryId}>
                                    <Tooltip title={country.countryName} placement="top" arrow>
                                        <Flag
                                            role="listitem"
                                            width={"90%"}
                                            src={country.flag}
                                            onClick={() =>
                                                history.push(`/resources/country-analysis?country=${country.countryId}`)
                                            }
                                        />
                                    </Tooltip>
                                </Grid>
                            );
                        })}
                    </ResourceGroup>
                )}
            </Grid>
            <Grid item md={6} xs={12}>
                {resources.comparativeAnalysis.length > 0 && (
                    <ResourceGroup title={i18n.t("Comparative analysis")} seeAllUrl={"/resources/comparative-analysis"}>
                        {resources.comparativeAnalysis.map(comparativeItem => {
                            return (
                                <Grid item key={comparativeItem.id}>
                                    <ComparativeAnalysisItem
                                        comparativeAnalysis={comparativeItem}
                                        minimalVersion
                                        analyticsPageTitle="Resources"
                                    />
                                </Grid>
                            );
                        })}
                    </ResourceGroup>
                )}
            </Grid>
            <Grid item md={6} xs={12}>
                {resources.multimedia.length > 0 && (
                    <ResourceGroup title={i18n.t("Multimedia")} seeAllUrl={"/resources/multimedia"}>
                        {resources.multimedia.map(multimediaItem => {
                            const analyticsEvent = redirectWithEvent({
                                name: "resource",
                                pageTitle: "Resources",
                                year: multimediaItem.date.getFullYear(),
                                resourceName: multimediaItem.title,
                                category: multimediaItem.kind,
                                theme: multimediaItem.themeName,
                            });

                            return (
                                <Grid item xs={12} key={multimediaItem.id}>
                                    <SimpleResourceItem
                                        title={multimediaItem.title}
                                        url={multimediaItem.url}
                                        image={multimediaItem.imageOriginal}
                                        date={multimediaItem.date}
                                        redirectWithEvent={analyticsEvent}
                                        maintainAspectRatio
                                        fullWidth
                                    />
                                </Grid>
                            );
                        })}
                    </ResourceGroup>
                )}
            </Grid>
            <Grid item md={6} xs={12}>
                {resources.news.length > 0 && (
                    <ResourceGroup title={i18n.t("News")} seeAllUrl={"/resources/news"}>
                        {resources.news.map(newsItem => {
                            const analyticsEvent = redirectWithEvent({
                                name: "resource",
                                pageTitle: "Resources",
                                year: newsItem.date.getFullYear(),
                                resourceName: newsItem.title,
                                category: newsItem.kind,
                            });

                            return (
                                <Grid item xs={12} spacing={5} key={newsItem.id}>
                                    <SimpleResourceItem
                                        title={newsItem.title}
                                        url={newsItem.url}
                                        image={newsItem.imageOriginal}
                                        date={newsItem.date}
                                        redirectWithEvent={analyticsEvent}
                                        maintainAspectRatio
                                        fullWidth
                                    />
                                </Grid>
                            );
                        })}
                    </ResourceGroup>
                )}
            </Grid>
        </>
    );
});

const Flag = styled.img`
    border: 1px solid #c5c3c3;
    margin-block: 16px;
    margin-inline-end: 16px;
    cursor: pointer;
`;
