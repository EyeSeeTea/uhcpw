import React from "react";
import { Typography } from "@material-ui/core";
import ReactMarkdown, { Components } from "react-markdown";
import styled from "styled-components";

import chartImg from "../../assets/region/ChartImg.png";
import { CoveragePolicyMap } from "./CoveragePolicyMap";
import { MapState } from "../../components/home/map/MapState";
import { CountryExperiences } from "./CountryExperiences";

type CoveragePolicySecondPanelProps = {
    title: string;
    content: string;
    chartTitle: string;
    notes: string;
    mapState: MapState;
};

export const CoveragePolicySecondPanel: React.FC<CoveragePolicySecondPanelProps> = props => {
    const { title, content, chartTitle, notes, mapState } = props;

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
            <ReactMarkdown components={markdownComponents}>{title}</ReactMarkdown>
            <ContentWrapper>
                <ReactMarkdown components={markdownComponents}>{content}</ReactMarkdown>
            </ContentWrapper>

            <MapContainer>
                <CoveragePolicyMap mapState={mapState} />
            </MapContainer>

            <ContentWrapper>
                <StyledTypography variant="h6" gutterBottom>
                    {chartTitle}
                </StyledTypography>
                <StyledImage src={chartImg} alt="Population coverage" />
                <ReactMarkdown components={markdownComponents}>{notes}</ReactMarkdown>
            </ContentWrapper>

            <ContentWrapper>
                <CountryExperiences />
            </ContentWrapper>
        </Container>
    );
};

const Container = styled.div`
    padding: 20px 50px 30px 50px;
`;

const StyledTypography = styled(Typography)`
    &.MuiTypography-h6 {
        font-weight: bold;
    }
`;

const ContentWrapper = styled.div`
    margin-block: 20px;
`;

const MapContainer = styled.div`
    margin-block: 20px;
    height: 500px;
    width: 100%;
`;

const StyledImage = styled.img`
    width: 100%;
    max-width: 800px;
    height: auto;
    margin-block-start: 16px;
`;

const StyledLi = styled.li`
    line-height: 1.43;
`;

const StyledUl = styled.ul`
    padding-inline-start: 14px;
`;
