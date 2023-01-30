import React from "react";
import { Button, Typography } from "@material-ui/core";
import i18n from "@eyeseetea/feedback-component/locales";
import styled from "styled-components";
import VisibilityIcon from "@material-ui/icons/Visibility";

export const MapWellcome: React.FC = () => {
    return (
        <>
            <Typography variant="h5">{i18n.t("Welcome to UHC Policy Watch,")}</Typography>
            <p>
                <strong>
                    {i18n.t("a platform for evidence on financial protection in Europe and Central Asia. ")}
                </strong>
                {i18n.t(
                    "Financial protection is at the heart of universal health coverage (UHC). Without it, people face barries to access or experience finalcial hardship when using health servicea, undetermining progress towardsUHC."
                )}
            </p>
            <p>
                <strong>{i18n.t("UHC Policy Watch allows  you to:")}</strong>
                <ul>
                    <li>{i18n.t("Access datam information and analysis for 50 countries")}</li>
                    <li>{i18n.t("Compare progress across countries")}</li>
                    <li>{i18n.t("Find out how to ensure access to health care is affordable for every one")}</li>
                </ul>
            </p>
            <p>
                {i18n.t("In this platform, umbrelas are used to denote the financial protection status of a country.")}
                <br />
                {i18n.t("This is divided into three categories:")}
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
            <SwitchColourButton variant="contained" color="default" startIcon={<VisibilityIcon />}>
                {i18n.t("Switch to colour-blind friendly")}
            </SwitchColourButton>
        </>
    );
};

const UmbrellaItemsContiner = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
`;

const UmbrellaItem = styled.div`
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

const SwitchColourButton = styled(Button)`
    margin-top: 32px;
`;
