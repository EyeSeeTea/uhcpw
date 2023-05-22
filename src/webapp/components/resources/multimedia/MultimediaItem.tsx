import { Box, Card, Typography } from "@material-ui/core";

import React from "react";
import styled from "styled-components";
import { Multimedia } from "../../../../domain/entities/resources/Resource";
import { Theme } from "../theme/Theme";

export interface CountryAnalysisProps {
    multimedia: Multimedia;
}

export const MultimediaItem: React.FC<CountryAnalysisProps> = React.memo(({ multimedia: news }) => {
    return (
        <Item elevation={0} role="listitem">
            <Column>
                <a href={news.url} style={{ width: "100%" }}>
                    <Image src={news.image} alt={news.title} />
                </a>

                <Box height={20} />
                <Row>
                    <Theme theme={news.theme} />
                    <Text variant="body1" gutterBottom>
                        {news.date}
                    </Text>
                </Row>
                <a href={news.url} style={{ textDecoration: "none", color: "black" }}>
                    <Text variant="body1">{news.title}</Text>
                </a>
            </Column>
        </Item>
    );
});

const Item = styled(Card)`
    border-radius: 10px;
    padding: 16px;
    flex-direction: column;
`;

const Column = styled.div`
    padding-bottom: 0px;
    display: flex;
    flex-direction: column;
    align-items: start;
`;

const Text = styled(Typography)`
    font-weight: normal;
`;

const Image = styled.img`
    width: 100%;
    height: 300px;
`;

const Row = styled.div`
    display: flex;
    flex-direction: row;
`;
