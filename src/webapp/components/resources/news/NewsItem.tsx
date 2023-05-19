import { Box, Card, Typography } from "@material-ui/core";

import React from "react";
import styled from "styled-components";
import { News } from "../../../../domain/entities/resources/Resource";

export interface CountryAnalysisProps {
    news: News;
}

export const NewsItem: React.FC<CountryAnalysisProps> = React.memo(({ news }) => {
    return (
        <Item elevation={0} role="listitem">
            <Column>
                <img width={"100%"} src={news.image} alt={news.title} />
                <Box height={20} />
                <Typography variant="body2">{news.date}</Typography>
                <Box height={20} />
                <Typography variant="body2">{news.title}</Typography>
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
