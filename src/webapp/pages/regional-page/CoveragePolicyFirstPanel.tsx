import React from "react";
import styled from "styled-components";
import { Grid, Typography } from "@material-ui/core";
import ReactMarkdown, { Components } from "react-markdown";

import fig19 from "../../assets/region/Fig19.png";

type CoveragePolicyFirstPanelProps = {
    leftContent: string;
    rightContent: string;
    bottomContent: string;
};

export const CoveragePolicyFirstPanel: React.FC<CoveragePolicyFirstPanelProps> = props => {
    const { leftContent, rightContent, bottomContent } = props;

    const markdownComponents: Components = React.useMemo(
        () => ({
            p: ({ children }) => (
                <Typography variant="h6" gutterBottom>
                    {children}
                </Typography>
            ),
            li: ({ children, ...props }) => <StyledLi {...props}>{children} </StyledLi>,
            ul: ({ children, ...props }) => <StyledUl {...props}>{children}</StyledUl>,
        }),
        []
    );

    return (
        <Container>
            <Grid container spacing={4} alignItems="flex-start">
                <Grid item md={12} lg={6}>
                    <ReactMarkdown components={markdownComponents}>{leftContent}</ReactMarkdown>

                    <StyledImage src={fig19} alt="Gaps in coverage chart" />
                </Grid>

                <Grid item md={12} lg={6}>
                    <ReactMarkdown components={markdownComponents}>{rightContent}</ReactMarkdown>
                </Grid>
            </Grid>

            <ReactMarkdown components={markdownComponents}>{bottomContent}</ReactMarkdown>
        </Container>
    );
};

const Container = styled.div`
    padding: 20px 50px 30px 50px;
`;

const StyledImage = styled.img`
    width: 100%;
    max-width: 500px;
    height: auto;
    margin-block-start: 16px;
`;

const StyledLi = styled.li`
    font-size: 20px;
    font-family: Lato;
    margin-block-end: 8px;
`;

const StyledUl = styled.ul`
    padding-inline-start: 14px;
    font-size: 20px;
`;
