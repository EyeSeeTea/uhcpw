import React from "react";
import { Typography } from "@material-ui/core";
import styled from "styled-components";
import veryWeakIconLegend from "../../../assets/map/icon-very-weak-legend.svg";
import strongIcon from "../../../assets/map/icon-strong.svg";
import gapsIcon from "../../../assets/map/icon-gaps.svg";
import i18n from "../../../../locales";
import { MainMapPanelContent } from "../../../../domain/entities/HomePageContent";
import ReactMarkdown from "react-markdown";
import { useAnalytics } from "../../../common/hooks/analytics/useAnalytics";
import { BREAKPOINT_WIDTH_SMALL_SCREEN } from "../../../common/hooks/screen/useIsSmallScreen";
import { VideoPillLink } from "../../video-pill/VideoPill";

type MainPanelProps = {
    mainPanelContent?: MainMapPanelContent;
    isMobile?: boolean;
};

export const HomePagePanel: React.FC<MainPanelProps> = ({ mainPanelContent, isMobile = false }) => {
    const { redirectWithPageView } = useAnalytics();

    const welcomeVideo = redirectWithPageView({
        title: "[Video] " + isMobile ? mainPanelContent?.videoLink : mainPanelContent?.buttonText,
    });

    return (
        <Container>
            {!isMobile && (
                <Typography variant="h2" style={{ fontWeight: 400 }} gutterBottom>
                    {mainPanelContent?.title}
                </Typography>
            )}

            {mainPanelContent?.description && (
                <ParagraphContainer>
                    <ReactMarkdown
                        components={{
                            p: ({ children }) => <Typography paragraph>{children}</Typography>,
                        }}
                    >
                        {mainPanelContent?.description}
                    </ReactMarkdown>
                </ParagraphContainer>
            )}

            {!isMobile && (
                <UmbrellaItemsContainer>
                    <UmbrellaItem>
                        <Marker src={veryWeakIconLegend} />
                        {i18n.t("Weaker financial protection")}
                    </UmbrellaItem>

                    <UmbrellaItem>
                        <Marker src={gapsIcon} />
                    </UmbrellaItem>

                    <UmbrellaItem>
                        <Marker src={strongIcon} />
                        <span>{i18n.t("Stronger financial protection")}</span>
                    </UmbrellaItem>
                </UmbrellaItemsContainer>
            )}

            {isMobile && mainPanelContent?.videoLink ? (
                <VideoWrapper>
                    <iframe
                        src={mainPanelContent?.videoLink}
                        title={i18n.t("UHC watch YouTube video player")}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture;"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                    />
                </VideoWrapper>
            ) : mainPanelContent?.buttonLink && mainPanelContent?.buttonText ? (
                <VideoPillLink
                    href={mainPanelContent?.buttonLink}
                    target="_blank"
                    rel="noreferrer"
                    onClick={welcomeVideo}
                    label={mainPanelContent?.buttonText}
                />
            ) : null}
        </Container>
    );
};

const Container = styled.div`
    overflow-y: auto;
    font-size: 16px;
    padding: 16px;
`;

const ParagraphContainer = styled.div`
    max-width: 46ch;
    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        max-width: 100%;
    }
`;

const UmbrellaItemsContainer = styled.div`
    display: flex;
    justify-content: space-between;
    margin-block: 48px 35px;
`;

const UmbrellaItem = styled.div`
    max-width: 150px;
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
`;

const Marker = styled.img`
    background-size: cover;
    width: 80px;
    margin-bottom: 16px;
`;

const VideoWrapper = styled.div`
    position: relative;
    width: 100%;
    max-width: 70ch;
    margin: 40px auto;
    aspect-ratio: 16 / 9;
    overflow: hidden;

    iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: none;
    }
`;
