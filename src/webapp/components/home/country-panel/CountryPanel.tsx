import React from "react";
import { Typography } from "@material-ui/core";
import styled from "styled-components";
import { Country } from "../../../../domain/entities/Country";
import ReactMarkdown from "react-markdown";
import weakIcon from "../../../assets/map/icon-weak.svg";
import strongIcon from "../../../assets/map/icon-strong.svg";
import gapsIcon from "../../../assets/map/icon-normal.svg";
import { Divider } from "material-ui";
export interface CountryPanelProps {
    country: Country;
}

export const CountryPanel: React.FC<CountryPanelProps> = ({ country }) => {
    return (
        <Container>
            <Row>
                <UmbrellaItem>
                    <Marker
                        src={country.status === "Strong" ? strongIcon : country.status === "Weak" ? weakIcon : gapsIcon}
                    />
                </UmbrellaItem>
                <Typography variant="h2" style={{ fontWeight: 400 }}>
                    {country.name}
                </Typography>
            </Row>
            <Divider style={{ backgroundColor: "white", margin: "38px 0px" }} />

            <ReactMarkdown>{country.summary}</ReactMarkdown>
        </Container>
    );
};

const Container = styled.div`
    overflow-y: auto;
    font-size: 16px;
    ul {
        padding-inline-start: 14px;
    }
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
`;

const UmbrellaItem = styled.div`
    display: flex;
    flex-direction: row;
    text-align: center;
    align-items: center;
`;

const Marker = styled.img`
    background-size: cover;
    width: 80px;
    margin-right: 24px;
    margin-bottom: 32px;
`;
