import React from "react";
import { Grid } from "@material-ui/core";
import styled from "styled-components";

import i18n from "../../../../locales";
import { ResourceGroup } from "../../../components/resources/resource-group/ResourceGroup";
import { ResourceItem } from "../../../components/resources/common/ResourceItem";
import { MultimediaState } from "../by-type/ResourcesByTypeState";
import { FilteredByTextResourcesState } from "./ResourcesState";

export const FilteredByTextResources: React.FC<{ resources: FilteredByTextResourcesState }> = React.memo(
    ({ resources }) => (
        <>
            <Grid item md={12} xs={12}>
                {resources.countryAnalysis.length > 0 && (
                    <ResourceGroup title={i18n.t("Country or area analysis")} seeAllUrl={"/resources/country-analysis"}>
                        {resources.countryAnalysis.map(countryAnalysis => (
                            <StyledGrid key={countryAnalysis.id} item lg={2} md={3} xs={6}>
                                <ResourceItem resource={countryAnalysis} analyticsPageTitle="Resources" />
                            </StyledGrid>
                        ))}
                    </ResourceGroup>
                )}
            </Grid>
            <Grid item md={12} xs={12}>
                {resources.comparativeAnalysis.length > 0 && (
                    <ResourceGroup title={i18n.t("Comparative analysis")} seeAllUrl={"/resources/comparative-analysis"}>
                        {resources.comparativeAnalysis.map(comparativeItem => (
                            <StyledGrid key={comparativeItem.id} item lg={2} md={3} xs={6}>
                                <ResourceItem resource={comparativeItem} analyticsPageTitle="Resources" />
                            </StyledGrid>
                        ))}
                    </ResourceGroup>
                )}
            </Grid>
            <Grid item md={12} xs={12}>
                {resources.multimedia.length > 0 && (
                    <ResourceGroup title={i18n.t("Multimedia")} seeAllUrl={"/resources/multimedia"}>
                        {resources.multimedia.map(multimediaItem => (
                            <StyledGrid key={multimediaItem.id} item lg={4} md={6} xs={12}>
                                <ResourceItem
                                    resource={multimediaItem as MultimediaState}
                                    analyticsPageTitle="Resources"
                                />
                            </StyledGrid>
                        ))}
                    </ResourceGroup>
                )}
            </Grid>
            <Grid item md={12} xs={12}>
                {resources.news.length > 0 && (
                    <ResourceGroup title={i18n.t("News")} seeAllUrl={"/resources/news"}>
                        {resources.news.map(newsItem => (
                            <StyledGrid key={newsItem.id} item lg={4} md={6} xs={12}>
                                <ResourceItem resource={newsItem} analyticsPageTitle="Resources" />
                            </StyledGrid>
                        ))}
                    </ResourceGroup>
                )}
            </Grid>
        </>
    )
);

const StyledGrid = styled(Grid)`
    padding: 20px;
`;
