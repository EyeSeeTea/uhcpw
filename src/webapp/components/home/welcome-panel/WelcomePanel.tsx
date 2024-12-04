import React from "react";
import ReactMarkdown from "react-markdown";
import { Typography } from "@material-ui/core";
import styled from "styled-components";
import weakIcon from "../../../assets/map/icon-weak.svg";
import strongIcon from "../../../assets/map/icon-strong.svg";
import gapsIcon from "../../../assets/map/icon-normal.svg";
import i18n from "../../../../locales";
import { colors } from "../../../pages/app/themes/dhis2.theme";
import { MainMapPanelContent } from "../../../../domain/entities/HomePageContent";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";

interface WelcomePanelProps {
    welcomePanelContent: MainMapPanelContent;
}

export const WelcomePanel: React.FC<WelcomePanelProps> = ({ welcomePanelContent }) => {
    return (
        <Container>
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
            {welcomePanelContent.buttonText && welcomePanelContent.buttonLink ? (
                <VideoLink href={welcomePanelContent.buttonLink} target="_blank" rel="noreferrer">
                    <PlayCircleFilledIcon style={{ color: "#FFFF" }} />
                    <Typography>{welcomePanelContent.buttonText}</Typography>
                </VideoLink>
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
    margin-block-start: 100px;
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
    padding: 5px 0px;
    color: ${colors.white};
    text-transform: initial;
    border-radius: 40px;
    &:hover {
        background-color: ${colors.accentPrimary};
        opacity: 0.8;
    }
`;
