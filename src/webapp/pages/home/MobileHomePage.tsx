import React from "react";
import styled from "styled-components";
import { Typography } from "@material-ui/core";

import { Map } from "../../components/home/map/Map";
import { useMap } from "../../components/home/map/useMap";
import { useHomeResources } from "./useHomeResources";
import { NewsletterButton } from "../../components/home/buttons/NewsletterButton";
import { useHomePageContent } from "./useHomePageContent";
import bubblePatternWhite from "../../assets/bubble-pattern-white.png";
import indicatorExplorer from "../../assets/indicator-explorer.svg";
import policyExplorer from "../../assets/policy-explorer.svg";
import { colors } from "../../pages/app/themes/dhis2.theme";
import i18n from "../../../locales";
import { useAnalytics } from "../../common/hooks/analytics/useAnalytics";
import { ResourcesCarousel } from "../../components/resources-carousel/ResourcesCarousel";
import { BREAKPOINT_WIDTH_SMALL_SCREEN } from "../../common/hooks/screen/useIsSmallScreen";

export const MobileHomePage: React.FC = React.memo(() => {
    const mapState = useMap();
    const { resources, news } = useHomeResources();
    const homePageContent = useHomePageContent();
    const { redirectWithPageView } = useAnalytics();
    const regionalReportPageView = redirectWithPageView({ title: "Regional report" });

    return (
        <React.Fragment>
            <NewsletterButton content={homePageContent.newsletter} />

            <MapSection>
                <Map mapState={mapState} welcomePanelContent={homePageContent.mainMapPanel} isMobile />
            </MapSection>

            <section>
                <Grid>
                    <BoxLink href={homePageContent.explorers.indicator.buttonLink || ""}>
                        <BigBox color={colors.orange}>
                            <BubbleImg
                                src={bubblePatternWhite}
                                alt="Bubble pattern"
                                aria-hidden="true"
                                decoding="async"
                                loading="eager"
                                isBig
                            />

                            <FlexWrapper>
                                <StyledTitleTypography>{i18n.t("Indicator explorer")}</StyledTitleTypography>

                                <Image src={indicatorExplorer} alt={i18n.t("indicator explorer")} />
                            </FlexWrapper>

                            <StyledTypography>
                                {i18n.t(
                                    "Over 50 indicators of financial hardship, unmet need for health care and spending on health"
                                )}
                            </StyledTypography>
                        </BigBox>
                    </BoxLink>

                    <BoxLink href={homePageContent.explorers.policy.buttonLink || ""}>
                        <BigBox color={colors.blue}>
                            <BubbleImg
                                src={bubblePatternWhite}
                                alt="Bubble pattern"
                                aria-hidden="true"
                                decoding="async"
                                loading="eager"
                                isBig
                            />

                            <FlexWrapper>
                                <StyledTitleTypography>{i18n.t("Policy explorer")}</StyledTitleTypography>

                                <Image src={policyExplorer} alt={i18n.t("policy explorer")} />
                            </FlexWrapper>

                            <StyledTypography>
                                {i18n.t(
                                    "Information on population coverage, service coverage, user charges and voluntary health insurance"
                                )}
                            </StyledTypography>
                        </BigBox>
                    </BoxLink>

                    <BoxLink href={homePageContent.analysis.countries.buttonLink || ""}>
                        <Box color={colors.darkBlue}>
                            <BubbleImg
                                src={bubblePatternWhite}
                                alt="Bubble pattern"
                                aria-hidden="true"
                                decoding="async"
                                loading="eager"
                            />

                            <StyledTitleTypography>{i18n.t("Countries & areas")}</StyledTitleTypography>
                        </Box>
                    </BoxLink>

                    <BoxLink
                        target="_blank"
                        href={homePageContent.analysis.regional.buttonLink || ""}
                        rel="noreferrer"
                        onClick={regionalReportPageView}
                    >
                        <Box color={colors.green}>
                            <BubbleImg
                                src={bubblePatternWhite}
                                alt="Bubble pattern"
                                aria-hidden="true"
                                decoding="async"
                                loading="eager"
                            />

                            <StyledTitleTypography>{i18n.t("Regional report")}</StyledTitleTypography>
                        </Box>
                    </BoxLink>

                    <BoxLink href={homePageContent.methods.buttonLink || ""}>
                        <Box color={colors.green}>
                            <BubbleImg
                                src={bubblePatternWhite}
                                alt="Bubble pattern"
                                aria-hidden="true"
                                decoding="async"
                                loading="eager"
                            />

                            <StyledTitleTypography>{i18n.t("Methods")}</StyledTitleTypography>
                        </Box>
                    </BoxLink>

                    <BoxLink href={homePageContent.resources.buttonLink || ""}>
                        <Box color={colors.darkBlue}>
                            <BubbleImg
                                src={bubblePatternWhite}
                                alt="Bubble pattern"
                                aria-hidden="true"
                                decoding="async"
                                loading="eager"
                            />

                            <StyledTitleTypography>{i18n.t("Resources")}</StyledTitleTypography>
                        </Box>
                    </BoxLink>
                </Grid>
            </section>

            <section>
                <SectionTitle>{i18n.t("Resources")}</SectionTitle>

                <ResourcesCarousel resourceItems={resources} />
            </section>

            <section>
                <SectionTitle>{i18n.t("News")}</SectionTitle>

                <ResourcesCarousel resourceItems={news} hideTag />
            </section>
        </React.Fragment>
    );
});

const SectionTitle = styled(Typography)`
    margin: 24px 32px 16px 32px;
    font-weight: 400;
    font-size: 24px;
    line-height: line;
    letter-spacing: 0%;
    vertical-align: middle;
`;

const MapSection = styled.section`
    height: 80vh;
    min-height: 620px;

    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        height: 50vh;
    }

    @media (max-width: 550px) {
        min-height: 600px;
    }

    @media (max-width: 500px) {
        min-height: 550px;
    }
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: auto;
    gap: 20px;
    padding: 32px;

    @media (max-width: 500px) {
        gap: 12px;
        padding: 20px;
    }
`;

const BoxLink = styled.a`
    text-decoration: none;
    color: inherit;
    display: block;
    cursor: pointer;
    height: 100%;
`;

const Box = styled.div<{ color: string }>`
    position: relative;
    background-color: ${props => props.color};
    padding: 14px;
    min-height: 30px;
    border-radius: 21px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    color: white;
    text-align: center;

    @media (max-width: 400px) {
        background-position: calc(100% + 70px) top;
    }
`;

const BubbleImg = styled.img<{ isBig?: boolean }>`
    position: absolute;
    top: 0;
    right: ${props => (props.isBig ? "-150px" : "0")};
    width: auto;
    height: 100%;
    opacity: 0.9;
    pointer-events: none;
`;

const BigBox = styled(Box)`
    text-align: left;
    min-height: 160px;
    background-position: calc(100% + 100px) top;

    @media (max-width: 800px) {
        background-position: calc(100% + 200px) top;
    }
`;

const FlexWrapper = styled.div`
    display: flex;
    gap: 30px;
    align-items: center;
    justify-content: space-between;
`;

const StyledTypography = styled(Typography)`
    letter-spacing: 0%;
    vertical-align: middle;
    font-weight: 400;
    font-size: 16px;
    letter-spacing: 0%;
    vertical-align: middle;

    @media (max-width: 575px) {
        font-size: 12px;
    }
`;

const StyledTitleTypography = styled(StyledTypography)`
    font-weight: 500;
    font-size: 20px;

    @media (max-width: 575px) {
        font-size: 16px;
    }

    @media (max-width: 360px) {
        font-size: 14px;
    }
`;

const Image = styled.img`
    width: 80px;

    @media (max-width: 500px) {
        width: 50px;
    }

    @media (max-width: 400px) {
        width: 30px;
    }
`;
