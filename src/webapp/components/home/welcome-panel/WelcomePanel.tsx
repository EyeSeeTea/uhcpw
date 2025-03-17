import React from "react";
import { Typography } from "@material-ui/core";
import styled from "styled-components";
import weakIcon from "../../../assets/map/icon-weak.svg";
import strongIcon from "../../../assets/map/icon-strong.svg";
import gapsIcon from "../../../assets/map/icon-normal.svg";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import i18n from "../../../../locales";
import { colors } from "../../../pages/app/themes/dhis2.theme";
import { MainMapPanelContent } from "../../../../domain/entities/HomePageContent";
import ReactMarkdown from "react-markdown";
import { useAnalytics } from "../../../common/hooks/analytics/useAnalytics";

interface WelcomePanelProps {
    welcomePanelContent: MainMapPanelContent;
}

export const WelcomePanel: React.FC<WelcomePanelProps> = ({ welcomePanelContent }) => {
    const { redirectWithPageView } = useAnalytics();

    const welcomeVideo = redirectWithPageView({ title: "[Video] " + welcomePanelContent.buttonText });

    return (
        <Container>
            <Typography variant="h2" style={{ fontWeight: 400 }} gutterBottom>
                {welcomePanelContent.title}
            </Typography>
            <ParagraphContainer>
                <ReactMarkdown
                    components={{
                        p: ({ children }) => <Typography paragraph>{children}</Typography>,
                    }}
                >
                    {welcomePanelContent.description}
                </ReactMarkdown>
            </ParagraphContainer>
            <UmbrellaItemsContainer>
                <UmbrellaItem>
                    <Marker src={weakIcon} />
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
            <VideoLink href={welcomePanelContent.buttonLink} target="_blank" rel="noreferrer" onClick={welcomeVideo}>
                <PlayCircleFilledIcon style={{ color: colors.accentPrimary }} />
                <Typography>{welcomePanelContent.buttonText}</Typography>
            </VideoLink>
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

const VideoLink = styled.a`
    display: flex;
    gap: 5px;
    width: fit-content;
    text-decoration: none;
    background-color: white;
    padding: 5px 15px;
    color: ${colors.accentPrimary};
    text-transform: initial;
    border-radius: 40px;
    &:hover {
        background-color: ${colors.greyLight};
    }
`;
