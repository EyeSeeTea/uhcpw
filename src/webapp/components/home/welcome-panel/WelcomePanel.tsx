import React from "react";
import { Typography } from "@material-ui/core";
import i18n from "@eyeseetea/feedback-component/locales";
import styled from "styled-components";
import weakIcon from "../../../assets/map/icon-weak.svg";
import strongIcon from "../../../assets/map/icon-strong.svg";
import gapsIcon from "../../../assets/map/icon-normal.svg";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";

const youtubeVideoLink = "https://www.youtube.com/watch?v=JTJmji04Iy4";

export const WelcomePanel: React.FC = () => {
    return (
        <Container>
            <Typography variant="h2" style={{ fontWeight: 400 }} gutterBottom>
                {i18n.t("UHC watch")}
            </Typography>
            <Typography paragraph>
                {i18n.t("Tracking progress on affordable access to health care in Europe and Central Asia")}
            </Typography>
            <Typography paragraph>
                {i18n.t(
                    "Affordable access to health care - financial protection - is at the heart of universal health coverage (UHC)"
                )}
            </Typography>
            <Typography paragraph>
                {i18n.t("UHC means everyone can use quality health care without financial hardship")}{" "}
            </Typography>
            <UmbrellaItemsContiner>
                <UmbrellaItem>
                    <Marker src={strongIcon} />
                    <span>{i18n.t("Stronger financial protection")}</span>
                </UmbrellaItem>
                <UmbrellaItem>
                    <Marker src={gapsIcon} />
                    {/* {i18n.t("Gaps in financial protection")} */}
                </UmbrellaItem>
                <UmbrellaItem>
                    <Marker src={weakIcon} />
                    {i18n.t("Weaker financial protection")}
                </UmbrellaItem>
            </UmbrellaItemsContiner>
            <VideoLink href={youtubeVideoLink} target="_blank" rel="noreferrer">
                <PlayCircleFilledIcon style={{ color: "white" }} />
                <Typography>{i18n.t("UHC watch")}</Typography>
            </VideoLink>
        </Container>
    );
};

const Container = styled.div`
    overflow-y: auto;
    font-size: 16px;
    padding: 16px;
`;

const UmbrellaItemsContiner = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 48px 0px 35px;
`;

const UmbrellaItem = styled.div`
    max-width: 170px;
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
    p {
        color: white;
    }
    &:hover {
        text-decoration: underline;
        text-decoration-color: white;
    }
`;
