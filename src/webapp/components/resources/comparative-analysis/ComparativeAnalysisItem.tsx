import { Box, Card, Typography } from "@material-ui/core";

import React from "react";
import styled from "styled-components";
import { ComparativeAnalysis } from "../../../../domain/entities/resources/Resource";
import { colors } from "../../../pages/app/themes/dhis2.theme";
import { Theme } from "../theme/Theme";

export interface CountryAnalysisProps {
    comparativeAnalysis: ComparativeAnalysis;
}

export const ComparativeAnalysisItem: React.FC<CountryAnalysisProps> = React.memo(({ comparativeAnalysis }) => {
    return (
        <Item elevation={0} role="listitem">
            <Column>
                <img width={"100%"} src={comparativeAnalysis.image} alt={comparativeAnalysis.text} />
                <Box height={20} />
                <Theme theme={comparativeAnalysis.theme} />
                <Row>
                    <Typography variant="body1">{comparativeAnalysis.year}</Typography>
                    <TextDivider>|</TextDivider>
                    {comparativeAnalysis.links.map((link, i) => {
                        return (
                            <>
                                <a key={link.url} href={link.url}>
                                    <Typography variant="body1">{link.language}</Typography>
                                </a>
                                {i < comparativeAnalysis.links.length - 1 && (
                                    <Typography variant="body1" style={{ marginRight: "4px" }}>
                                        ,
                                    </Typography>
                                )}
                            </>
                        );
                    })}
                </Row>
                <Box height={6} />
                <Typography variant="body2">{comparativeAnalysis.text}</Typography>
            </Column>
        </Item>
    );
});

const Item = styled(Card)`
    border-radius: 10px;
    padding: 16px;
    flex-direction: column;
    a {
        text-decoration: none;
        font-size: 14px;
        color: ${colors.accentPrimary};
    }
`;

const Row = styled.div`
    padding-top: 8px;
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
`;

const Column = styled.div`
    padding-bottom: 0px;
    display: flex;
    flex-direction: column;
    align-items: start;
`;

const TextDivider = styled(Typography)`
    margin: 0 4px;
`;
