import { Box, Divider, Typography } from "@material-ui/core";

import React from "react";
import styled from "styled-components";
import { AnalysisResource } from "../../../../domain/entities/resources/Resource";
import { Theme } from "../theme/Theme";

export interface CountryAnalysisProps {
    analysisResource: AnalysisResource;
    minimalVersion?: boolean;
}

export const AnalysisItem: React.FC<CountryAnalysisProps> = React.memo(({ analysisResource, minimalVersion }) => {
    return (
        <Column>
            <Cover width={"100%"} src={analysisResource.image} alt={analysisResource.text} />
            <Box height={20} />
            <Theme theme={analysisResource.theme} />
            {!minimalVersion && (
                <>
                    <Row>
                        <Typography variant="body1">{analysisResource.year}</Typography>

                        <StyledDivider orientation="vertical" flexItem />

                        {analysisResource.links.map((link, index) => {
                            return (
                                <>
                                    <a key={link.url} href={link.url} style={{ fontSize: "16px" }}>
                                        {link.language}
                                    </a>
                                    {index < analysisResource.links.length - 1 && (
                                        <StyledDivider orientation="vertical" flexItem />
                                    )}
                                </>
                            );
                        })}
                    </Row>
                    <Box height={6} />
                    <Typography variant="body1">{analysisResource.text}</Typography>
                </>
            )}
        </Column>
    );
});

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
