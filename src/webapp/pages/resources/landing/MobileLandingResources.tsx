import React from "react";
import styled from "styled-components";

import i18n from "../../../../locales";
import { ResourceGroup } from "../../../components/resources/resource-group/ResourceGroup";
import { LandingResourcesState } from "./ResourcesState";
import { ResourcesCarousel } from "../../../components/resources-carousel/ResourcesCarousel";

export const MobileLandingResources: React.FC<{ resources: LandingResourcesState }> = React.memo(({ resources }) => {
    return (
        <>
            <CarouselContainer>
                {resources.countryAnalysisByCountry.length > 0 && (
                    <ResourceGroup
                        title={i18n.t("Country analysis")}
                        seeAllUrl={"/resources/country-analysis"}
                        isMobileLanding
                    >
                        <ResourcesCarousel resourceItems={resources.countryAnalysisByCountry} />
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
