import { Box, Divider, Typography } from "@material-ui/core";

import React from "react";
import styled from "styled-components";
import { AnalysisResource } from "../../../../domain/entities/resources/Resource";
import { Tag } from "../tag/Tag";
import { useHistory } from "react-router-dom";

export interface CountryAnalysisProps {
    analysisResource: AnalysisResource;
    minimalVersion?: boolean;
    type: "country-analysis" | "comparative-analysis";
}

const themeColor: Record<string, string> = {
    "Financial Protection": "#008ad7",
    Resilience: "#4fad56",
    "Spending on Health": "#0360a7",
    "Voluntary Health Insurance": "#ff8d4e",
};

export const AnalysisItem: React.FC<CountryAnalysisProps> = React.memo(({ analysisResource, minimalVersion, type }) => {
    const history = useHistory();

    const handleTagClick = () => {
        history.push(`/resources/${type}?theme=${analysisResource.theme}`);
    };

    return (
        <Column>
            <a href={analysisResource.links[0]?.url} target="_blank" rel="noreferrer">
                <Cover width={"100%"} src={analysisResource.image} alt={analysisResource.title} />
            </a>

            <Box height={20} />
            <Tag theme={analysisResource.theme} color={themeColor[analysisResource.theme]} onClick={handleTagClick} />
            {!minimalVersion && (
                <>
                    <Row>
                        <Typography variant="body1">{analysisResource.date.getFullYear()}</Typography>

                        <StyledDivider orientation="vertical" flexItem />

                        {analysisResource.links.map((link, index) => {
                            return (
                                <React.Fragment key={link.url}>
                                    <a href={link.url} style={{ fontSize: "16px" }}>

                                        {link.language}
                                    </a>
                                    {index < analysisResource.links.length - 1 && (
                                        <StyledDivider orientation="vertical" flexItem />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </Row>
                    <Box height={6} />
                    <Typography variant="body1">{analysisResource.title}</Typography>
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
    min-height: 14rem;
    max-height: 14rem;
    @media (max-width: 960px) {
        min-height: 19rem;
        max-height: 19rem;
    }
`;
