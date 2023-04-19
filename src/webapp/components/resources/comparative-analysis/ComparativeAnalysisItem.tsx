import { Box, Card, Typography } from "@material-ui/core";

import React from "react";
import styled from "styled-components";
import { ComparativeAnalysis, ResourceTheme } from "../../../../domain/entities/ResourceElement";

const themeColor: Record<ResourceTheme, string> = {
    "Financial protection": "#008ad7",
    "Resilience and financial sustainability": "#4fad56",
    "Spending on health": "#0360a7",
    "Voluntary health insurance": "#ff8d4e",
};

export interface CountryAnalysisProps {
    comparativeAnalysis: ComparativeAnalysis;
}

export const ComparativeAnalysisItem: React.FC<CountryAnalysisProps> = React.memo(({ comparativeAnalysis }) => {
    return (
        <Item elevation={0}>
            <Column>
                <img width={"100%"} src={comparativeAnalysis.image} alt={comparativeAnalysis.text} />
                <Box height={20} />
                <Row>
                    <Column>
                        <Typography variant="body2">{comparativeAnalysis.year}</Typography>
                        <Typography variant="body2" color="primary">
                            {comparativeAnalysis.languages}
                        </Typography>
                    </Column>

                    <Tag background={themeColor[comparativeAnalysis.theme]}>
                        <Typography variant="body2" style={{ color: "white" }} align="center">
                            {comparativeAnalysis.theme}
                        </Typography>
                    </Tag>
                </Row>
                <Box height={6} />
                <Typography variant="body2">{comparativeAnalysis.text}</Typography>
            </Column>
        </Item>
    );
});

const Row = styled.div`
    padding-top: 8px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: start;
    width: 100%;
`;

const Column = styled.div`
    padding-bottom: 0px;
    display: flex;
    flex-direction: column;
    align-items: start;
`;

const Item = styled(Card)`
    border-radius: 10px;
    padding: 16px;
    flex-direction: column;
`;

const Tag = styled.div<{ background: string }>`
    border-radius: 20px;
    background: ${props => props.background};
    color: #174587;
    padding: 4px 16px;
    display: inline-block;
    margin-left: 16px;
`;
