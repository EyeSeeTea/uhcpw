import React from "react";
import { Button, Typography } from "@material-ui/core";
import styled from "styled-components";
import { Country } from "../../../../domain/entities/Country";
import ReactMarkdown from "react-markdown";
import weakIcon from "../../../assets/map/icon-weak.svg";
import strongIcon from "../../../assets/map/icon-strong.svg";
import gapsIcon from "../../../assets/map/icon-normal.svg";
import { Divider } from "material-ui";
import { colors } from "../../../pages/app/themes/dhis2.theme";
export interface CountryPanelProps {
    country: Country;
}

type ButtonItemType = {
    href?: string | undefined;
    children: React.ReactNode;
};

export const ButtonItem: React.FC<ButtonItemType> = ({ href, children }) => {
    return (
        <a href={href} target="_blank" rel="noreferrer">
            <StyledButton>{children}</StyledButton>
        </a>
    );
};

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

            <ReactMarkdown
                components={{
                    a: ({ ...props }) => <ButtonItem {...props} />,
                }}
            >
                {country.summary}
            </ReactMarkdown>
        </Container>
    );
};

const Container = styled.div`
    overflow-y: auto;
    font-size: 16px;
    ul {
        list-style-position: inside;
        padding-left: 0;
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

const StyledButton = styled(Button)`
    background-color: white;
    padding: 5px 30px;
    color: ${colors.accentPrimary};
    text-transform: initial;
    border-radius: 40px;
    &:hover {
        background-color: ${colors.greyLight};
    }
`;
