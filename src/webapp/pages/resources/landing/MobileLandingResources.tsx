import React from "react";
import styled from "styled-components";
import { Grid, Tooltip } from "@material-ui/core";
import { useHistory } from "react-router-dom";

import i18n from "../../../../locales";
import { ResourceGroup } from "../../../components/resources/resource-group/ResourceGroup";
import { LandingResourcesState } from "./ResourcesState";
import { ResourcesCarousel } from "../../../components/resources-carousel/ResourcesCarousel";
import { formatCountryOrRegionParamName } from "../../../utils/formatCountryOrRegionParamName";

export const MobileLandingResources: React.FC<{ resources: LandingResourcesState }> = React.memo(({ resources }) => {
    const history = useHistory();
    return (
        <>
            <CarouselContainer>
                {resources.countryAnalysisByCountry.length > 0 && (
                    <ResourceGroup
                        title={i18n.t("Country analysis")}
                        seeAllUrl={"/resources/country-analysis"}
                        centerItems
                    >
                        {resources.countryAnalysisByCountry.map(country => {
                            return (
                                <Grid item lg={2} md={2} sm={2} xs={3} key={country.countryId}>
                                    <Tooltip title={country.countryName} placement="top" arrow>
                                        <Flag
                                            role="listitem"
                                            src={country.flag}
                                            onClick={() =>
                                                history.push(
                                                    `/resources/country-analysis/${formatCountryOrRegionParamName(
                                                        country.countryName
                                                    )}`
                                                )
                                            }
                                        />
                                    </Tooltip>
                                </Grid>
                            );
                        })}
                    </ResourceGroup>
                )}
            </CarouselContainer>

            <CarouselContainer>
                {resources.comparativeAnalysis.length > 0 && (
                    <ResourceGroup
                        title={i18n.t("Comparative analysis")}
                        seeAllUrl={"/resources/comparative-analysis"}
                        isMobileLanding
                    >
                        <ResourcesCarousel resourceItems={resources.comparativeAnalysis} />
                    </ResourceGroup>
                )}
            </CarouselContainer>

            <CarouselContainer>
                {resources.multimedia.length > 0 && (
                    <ResourceGroup title={i18n.t("Multimedia")} seeAllUrl={"/resources/multimedia"} isMobileLanding>
                        <ResourcesCarousel resourceItems={resources.multimedia} />
                    </ResourceGroup>
                )}
            </CarouselContainer>

            <CarouselContainer>
                {resources.news.length > 0 && (
                    <ResourceGroup title={i18n.t("News")} seeAllUrl={"/resources/news"} isMobileLanding>
                        <ResourcesCarousel resourceItems={resources.news} />
                    </ResourceGroup>
                )}
            </CarouselContainer>
        </>
    );
});

const CarouselContainer = styled.div`
    width: 100%;
`;

const Flag = styled.img`
    border: 1px solid #c5c3c3;
    margin-block-start: 8px;
    cursor: pointer;
    max-width: 80px;

    @media (max-width: 400px) {
        max-width: 70px;
    }
`;
