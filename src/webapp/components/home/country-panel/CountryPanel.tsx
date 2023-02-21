import React from "react";
import { Typography } from "@material-ui/core";
import i18n from "@eyeseetea/feedback-component/locales";
import styled from "styled-components";
import { Country } from "../../../../domain/entities/Country";

export interface CountryPanelProps {
    country: Country;
}

export const CountryPanel: React.FC<CountryPanelProps> = ({ country }) => {
    return (
        <Container>
            <Typography variant="h5">{country.name}</Typography>
            <UmbrellaItem>
                <Marker src="https://docs.mapbox.com/help/demos/custom-markers-gl-js/mapbox-icon.png" />
                {i18n.t("Financial protection status: Weak", { nsSeparator: false })}
            </UmbrellaItem>
            <p>
                <strong> {i18n.t("Financial hardship (2018)")}</strong>
            </p>
            <p> {i18n.t("8% of households are improverished of futher improverished after out-of-pocket payments.")}</p>
            <p> {i18n.t("19% of households experiences catastrophic health spending.")}</p>
            <p>
                {i18n.t(
                    "Poorer households, older people and people in rural areas are most at risk of financial hardship."
                )}
            </p>
            <p>
                {i18n.t(
                    "Financial hardship is generally driven by spending on outpatient medicines, medical products and inpatient care; outpatient medicines are the main driver for poorer households."
                )}
            </p>
            <p>
                <strong> {i18n.t("Unmet need (2020)")}</strong>
            </p>
            <p>{i18n.t("1.4% of people report unmet need for health care")}</p>
            <p>{i18n.t("2.4% of people report unmet need for dental care")}</p>
            <p>
                <strong> {i18n.t("Find out")}</strong>
                {i18n.t("2.4% of people report unmet need for dental care")}
            </p>
            <div>
                <a href="/">{i18n.t("Go to the Bulgaria country page")}</a>
            </div>
            <div>
                <a href="/">{i18n.t("Download the Bulgaria financial protection report")}</a>
            </div>
        </Container>
    );
};

const Container = styled.div`
    overflow: scroll;
`;

const UmbrellaItem = styled.div`
    display: flex;
    flex-direction: row;
    text-align: center;
    align-items: center;
`;

const Marker = styled.img`
    background-image: url("https://docs.mapbox.com/help/demos/custom-markers-gl-js/mapbox-icon.png");
    background-size: cover;
    width: 50px;
`;
