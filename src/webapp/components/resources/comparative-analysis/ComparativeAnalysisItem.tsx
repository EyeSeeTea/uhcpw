import { Box, Card, Typography } from "@material-ui/core";

import React from "react";
import styled from "styled-components";
import { ComparativeAnalysis } from "../../../../domain/entities/resources/Resource";
import { colors } from "../../../pages/app/themes/dhis2.theme";
import { Theme } from "../theme/Theme";

export interface CountryAnalysisProps {
    comparativeAnalysis: ComparativeAnalysis;
    minimalVersion?: boolean;
}

export const ComparativeAnalysisItem: React.FC<CountryAnalysisProps> = React.memo(
    ({ comparativeAnalysis, minimalVersion }) => {
        return (
            <Item elevation={0} role="listitem">
                <Column>
                    <img width={"100%"} src={comparativeAnalysis.image} alt={comparativeAnalysis.text} />
                    <Box height={10} />
                    <Row>
                        {!minimalVersion && (
                            <Column style={{ marginRight: "16px" }}>
                                <Typography variant="body2">{comparativeAnalysis.year}</Typography>

                                {comparativeAnalysis.links.map(link => {
                                    return (
                                        <a key={link.url} href={link.url}>
                                            {link.language}
                                        </a>
                                    );
                                })}
                            </Column>
                        )}

                        <Theme theme={comparativeAnalysis.theme} />
                    </Row>
                    <Box height={6} />
                    {!minimalVersion && <Typography variant="body2">{comparativeAnalysis.text}</Typography>}
                </Column>
            </Item>
        );
    }
);

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
