import React from "react";
import styled from "styled-components";
import { Typography } from "@material-ui/core";
import ReactMarkdown, { Components } from "react-markdown";

import { Id } from "../../../domain/entities/Ref";
import { BREAKPOINT_WIDTH_SMALL_SCREEN, useIsSmallScreen } from "../../common/hooks/screen/useIsSmallScreen";
import { colors } from "../app/themes/dhis2.theme";
import { VisualizationPlugin } from "../../components/visualization/VisualizationPlugin";
import ScreenshotModal from "../../components/screenshot-modal/ScreenshotModal";

export type VisualContent = {
    title: string;
    textAbove: string;
    textBelow: string;
    visualizationId: string;
    visualizationName: string;
    years: string[];
    countries: Id[];
};

type GapsInCoverageTestPanelProps = {
    regionId: Id;
    mainText?: string;
    progressText?: string;
    visual: VisualContent;
};

export const GapsInCoverageTestPanel: React.FC<GapsInCoverageTestPanelProps> = props => {
    const isSmallScreen = useIsSmallScreen();

    const { regionId, mainText, progressText, visual } = props;
    const [currentGraphScreenshot, setCurrentGraphScreenshot] = React.useState<VisualContent | undefined>(undefined);

    const handleOpenScreenshot = React.useCallback((graph: VisualContent) => {
        setCurrentGraphScreenshot(graph);
    }, []);

    const handleCloseScreenshot = React.useCallback(() => {
        setCurrentGraphScreenshot(undefined);
    }, []);

    const markdownComponents: Components = React.useMemo(
        () => ({
            p: ({ children }) => (
                <Paragraph variant="body1" gutterBottom>
                    {children}
                </Paragraph>
            ),
            li: ({ children, ...props }) => <StyledLi {...props}>{children} </StyledLi>,
            ul: ({ children, ...props }) => <StyledUl {...props}>{children}</StyledUl>,
        }),
        []
    );

    const analyticsContent = React.useMemo(
        () => ({
            contentGroup: "chart",
            contentId: currentGraphScreenshot?.visualizationName,
        }),
        [currentGraphScreenshot?.visualizationName]
    );

    return (
        <Container>
            {mainText && visual.textAbove ? (
                <ContentWrapper>
                    <TextContainer>
                        <ReactMarkdown components={markdownComponents}>{mainText}</ReactMarkdown>
                    </TextContainer>

                    <TextContainer>
                        <ReactMarkdown components={markdownComponents}>{visual.textAbove}</ReactMarkdown>
                    </TextContainer>
                </ContentWrapper>
            ) : null}

            <React.Fragment key={`region-${regionId}-visual-content`}>
                <VisualizationContainer key={visual.visualizationId}>
                    <VisualizationPlugin
                        visualizationId={visual.visualizationId}
                        visualizationName={visual.visualizationName}
                        years={visual.years}
                        countries={visual.countries}
                        withoutBackground
                        useHeaderForCountryOrRegionalPage
                        showDialogInFullScreen={isSmallScreen}
                        onDownloadImage={() => handleOpenScreenshot(visual)}
                        analyticsPageTitle={"Regional page"}
                        isRegionalPage
                    />
                </VisualizationContainer>
            </React.Fragment>

            {currentGraphScreenshot &&
            currentGraphScreenshot.visualizationId &&
            currentGraphScreenshot.years &&
            currentGraphScreenshot.countries ? (
                <ScreenshotModal
                    open={true}
                    onClose={handleCloseScreenshot}
                    title={currentGraphScreenshot.visualizationName || ""}
                    backgroundColor={"#f1f9fc"}
                    analyticsPageTitle={"Regional page"}
                    analyticsContent={analyticsContent}
                    forceRotation={isSmallScreen}
                >
                    <VisualizationPlugin
                        visualizationId={currentGraphScreenshot.visualizationId}
                        visualizationName={currentGraphScreenshot.visualizationName}
                        years={currentGraphScreenshot.years}
                        countries={currentGraphScreenshot.countries}
                        withoutBackground
                        useHeaderForCountryOrRegionalPage
                        isScreenshot={true}
                        analyticsPageTitle={"Regional page"}
                        isRegionalPage
                    />
                </ScreenshotModal>
            ) : null}

            {progressText && visual.textAbove ? (
                <ContentWrapper style={{ marginTop: "10px" }}>
                    <TextContainer>
                        <ReactMarkdown components={markdownComponents}>{progressText}</ReactMarkdown>
                    </TextContainer>

                    <TextContainer>
                        <ReactMarkdown components={markdownComponents}>{visual.textBelow}</ReactMarkdown>
                    </TextContainer>
                </ContentWrapper>
            ) : null}
        </Container>
    );
};

const ContentWrapper = styled.div`
    display: grid;
    grid-template-columns: minmax(0, 50%) minmax(0, 50%);
    gap: 80px;
    width: 100%;
    align-items: stretch;
    > * {
        min-height: 0;
    }

    @media (max-width: 1280px) {
        grid-template-columns: 1fr;
        gap: 8px;
    }
`;

const Container = styled.div`
    max-width: 100%;
    padding: 20px 50px 30px 50px;

    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        padding: 30px;
        padding-inline-start: 0px;
    }
`;

const Paragraph = styled(Typography)`
    font-family: Lato;
    margin-block: 10px;
    font-size: 1rem;
    color: ${colors.black};

    &:first-child {
        margin-block-start: 0;
    }

    &:last-child {
        margin-block-end: 0;
    }
`;

const StyledLi = styled.li`
    font-family: Lato;
    font-size: 1rem;
    line-height: 1.43;
    color: ${colors.black};
`;

const StyledUl = styled.ul`
    font-family: Lato;
    font-size: 1rem;
    padding-inline-start: 14px;
    color: ${colors.black};
    margin-inline-start: 0;
    margin-block-start: 0;
    margin-block-end: 0;
`;

const VisualizationContainer = styled.div<{ $hasMargin?: boolean; $hide?: boolean }>`
    max-width: 100%;
    display: ${props => (props.$hide ? "none" : "block")};

    .VisualizationPlugin-container {
        padding: 0;
    }
    .visualization-plugin-header {
        .MuiTypography-h6 {
            margin: 0 !important;
        }
    }
    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        padding: 0;
        margin-block-start: ${props => (props.$hasMargin ? "20px" : "0")};

        > div {
            padding: 0;
        }
    }
`;

const TextContainer = styled.div``;
