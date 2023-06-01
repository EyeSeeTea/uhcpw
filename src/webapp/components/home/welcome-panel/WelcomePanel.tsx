import React from "react";
import { Typography } from "@material-ui/core";
import i18n from "@eyeseetea/feedback-component/locales";
import styled from "styled-components";

export const WelcomePanel: React.FC = () => {
    return (
        <Container>
            <Typography variant="h3">{i18n.t("UHC Watch")}</Typography>
            <p>
                <strong>{i18n.t("Can people afford to play for health care?")}</strong>
                <br />
                <strong>{i18n.t("Evidence on financial protection in Europe and Central Asia")}</strong>
            </p>
            <p>
                {i18n.t(
                    "Universal health coverage (UHC) means everyone can use the quality health care they need without financial hardship."
                )}
            </p>
            <p>
                {i18n.t(
                    "Without it, people face barries to access and experience financial hardship when using health care"
                )}
                <ul>
                    <li>{i18n.t("Explore data and analysis in financial protection")}</li>
                    <li>{i18n.t("Compare country progress towards UHC")}</li>
                    <li>{i18n.t("Find out how to make health care affordable for everyone")}</li>
                </ul>
            </p>
            <UmbrellaItemsContiner>
                <UmbrellaItem>
                    <Marker src="https://docs.mapbox.com/help/demos/custom-markers-gl-js/mapbox-icon.png" />
                    <span>{i18n.t("String financial protection")}</span>
                </UmbrellaItem>
                <UmbrellaItem>
                    <Marker src="https://docs.mapbox.com/help/demos/custom-markers-gl-js/mapbox-icon.png" />
                    {i18n.t("Gaps in financial protection")}
                </UmbrellaItem>
                <UmbrellaItem>
                    <Marker src="https://docs.mapbox.com/help/demos/custom-markers-gl-js/mapbox-icon.png" />
                    {i18n.t("Weak financial protection")}
                </UmbrellaItem>
            </UmbrellaItemsContiner>
        </Container>
    );
};

const Container = styled.div`
    overflow-y: auto;
    font-size: 16px;
`;

const UmbrellaItemsContiner = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

const UmbrellaItem = styled.div`
    max-width: 170px;
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
`;

const Marker = styled.img`
    background-image: url("https://docs.mapbox.com/help/demos/custom-markers-gl-js/mapbox-icon.png");
    background-size: cover;
    width: 100px;
`;
