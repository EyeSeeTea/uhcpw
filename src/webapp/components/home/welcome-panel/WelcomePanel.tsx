import React from "react";
import { Typography } from "@material-ui/core";
import i18n from "@eyeseetea/feedback-component/locales";
import styled from "styled-components";
import weakIcon from "../../../assets/map/icon-weak.svg";
import strongIcon from "../../../assets/map/icon-strong.svg";
import gapsIcon from "../../../assets/map/icon-normal.svg";

export const WelcomePanel: React.FC = () => {
    return (
        <Container>
            <Typography variant="h2" style={{ fontWeight: 400 }}>
                {i18n.t("UHC Watch")}
            </Typography>

            <p>
                <Typography variant="body1">
                    {i18n.t(
                        "Universal health coverage (UHC) means everyone can use the quality health care they need without financial hardship."
                    )}
                </Typography>
            </p>
            <p>
                <Typography variant="body1">
                    {i18n.t("Financial protection - affordable access to health care - is at the heart of UHC")}{" "}
                </Typography>
            </p>
            <p>
                <Typography variant="body1">{i18n.t("Can people afford to pay for health care?")} </Typography>
            </p>
            <p>
                <Typography variant="body1">
                    {i18n.t("Explore new evidence on financial protection in Europe and Central Asia")}{" "}
                </Typography>
            </p>
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
    margin-top: 48px;
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
