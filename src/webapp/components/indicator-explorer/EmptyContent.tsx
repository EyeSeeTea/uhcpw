import { Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import i18n from "../../../locales";
import GridOnIcon from "@material-ui/icons/GridOn";

export const EmptyContent: React.FC = () => {
    return (
        <Container>
            <Content>
                <Row>
                    <div>
                        <Title variant="h5">{i18n.t("Select Category")}</Title>
                        <Text>
                            {i18n.t("Select a category to track indicators and compare them across countries.")}
                            <br />
                            <br />
                            {i18n.t("Data are not available for all countries or all years.")}
                            <br />
                            <br />
                            {i18n.t("Data on financial protection are not currently available for")}{" "}
                            <b>
                                {i18n.t(
                                    "Andorra, Azerbaijan, Belarus, Iceland, Kazakhstan, Kyrgyzstan, Monaco, Norway, the Russian Federation, San Marino, Turkmenistan and Uzbekistan."
                                )}
                            </b>
                        </Text>
                    </div>
                    <GridOnIcon htmlColor="white" fontSize="large" />
                </Row>
            </Content>
        </Container>
    );
};

const Row = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 50px;
    margin-bottom: 50px;
`;

const Content = styled.div`
    border-radius: 10px;
    background: #cce8f7;
    max-width: 550px;
    padding: 48px 32px;
    MuiSvgIcon-fontSizeLarge {
        font-size: 10rem;
    }
`;

const Title = styled(Typography)`
    color: #008ad7;
`;

const Text = styled(Typography)`
    max-width: 340px;
    margin-top: 16px;
`;
