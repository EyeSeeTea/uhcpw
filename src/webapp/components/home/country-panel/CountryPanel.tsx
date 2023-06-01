import React from "react";
import { Typography } from "@material-ui/core";
import i18n from "@eyeseetea/feedback-component/locales";
import styled from "styled-components";
import { Country } from "../../../../domain/entities/Country";
import ReactMarkdown from "react-markdown";

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
            <ReactMarkdown>{country.summary}</ReactMarkdown>
        </Container>
    );
};

const Container = styled.div`
    overflow-y: auto;
    font-size: 16px;
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
