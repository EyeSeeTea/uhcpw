import { Box, Card, Divider, Typography } from "@material-ui/core";

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
                <Cover width={"100%"} src={comparativeAnalysis.image} alt={comparativeAnalysis.text} />
                <Box height={20} />
                <Theme theme={comparativeAnalysis.theme} />
                <Row>
                    <Typography variant="body1">{comparativeAnalysis.year}</Typography>

                    <StyledDivider orientation="vertical" flexItem />

                    {comparativeAnalysis.links.map((link, index) => {
                        return (
                            <>
                                <a key={link.url} href={link.url} style={{ fontSize: "16px" }}>
                                    {link.language}
                                </a>
                                {index < comparativeAnalysis.links.length - 1 && (
                                    <StyledDivider orientation="vertical" flexItem />
                                )}
                            </>
                        );
                    })}
                </Row>
                <Box height={6} />
                <Typography variant="body1">{comparativeAnalysis.text}</Typography>
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
    justify-content: flex-start;
`;

const StyledDivider = styled(Divider)`
    margin: 0px 8px 0px 4px;
`;

const Column = styled.div`
    padding-bottom: 0px;
    display: flex;
    flex-direction: column;
    align-items: start;
`;

const Cover = styled.img`
    border: 1px solid #c3bfbf;
`;
