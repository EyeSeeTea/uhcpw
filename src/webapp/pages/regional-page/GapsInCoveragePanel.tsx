import React, { useState } from "react";
import styled from "styled-components";
import { IconButton, Typography } from "@material-ui/core";
import ReactMarkdown, { Components } from "react-markdown";
import InfoIcon from "@material-ui/icons/Info";

import i18n from "../../../locales";
import { Id } from "../../../domain/entities/Ref";
import { BREAKPOINT_WIDTH_SMALL_SCREEN, useIsSmallScreen } from "../../common/hooks/screen/useIsSmallScreen";
import { colors } from "../app/themes/dhis2.theme";
import { FullScreenNotesDialog } from "../../components/dialog/FullScreenNotesDialog";
import { NotesDialog } from "../../components/dialog/NotesDialog";
import { VisualizationPlugin } from "../../components/visualization/VisualizationPlugin";
import ScreenshotModal from "../../components/screenshot-modal/ScreenshotModal";
import { PolicyExplorerTable } from "./PolicyExplorerTable";

export type VisualContent = {
    visual?: string;
    title?: string;
    textAbove?: string;
    textBelow?: string;
    textInfo?: string;
    visualizationId?: string;
    visualizationName?: string;
    currentCountryOrRegion?: Id;
    years?: string[];
    countries?: Id[];
    regions?: Id[];
    seriesColors?: Record<string, string>;
    policyCategoryId?: string;
};

type GapsInCoveragePanelProps = {
    regionId: Id;
    mainText?: string;
    progressText?: string;
    visuals?: VisualContent[];
    showDialogInFullScreen?: boolean;
};

export const GapsInCoveragePanel: React.FC<GapsInCoveragePanelProps> = props => {
    const isSmallScreen = useIsSmallScreen();

    const { regionId, mainText, progressText, visuals, showDialogInFullScreen = false } = props;
    const [visualTextInfo, setVisualTextInfo] = useState<string | undefined>(undefined);
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
            {mainText && (
                <TextContainer>
                    <ReactMarkdown components={markdownComponents}>{mainText}</ReactMarkdown>
                </TextContainer>
            )}

            {visuals?.map((visualContent, index) => (
                <React.Fragment key={`region-${regionId}-visual-content-${index}`}>
                    {visualContent.textAbove && (
                        <TextContainer style={{ marginTop: "12px" }}>
                            <ReactMarkdown components={markdownComponents}>{visualContent.textAbove}</ReactMarkdown>
                        </TextContainer>
                    )}

                    {visualContent.title && !visualContent.visualizationId && !visualContent.policyCategoryId ? (
                        <ChartTitleRow>
                            <ChartTitle variant="h6" gutterBottom>
                                {visualContent.title}
                            </ChartTitle>

                            <StyledIconButton
                                onClick={() => setVisualTextInfo(visualContent?.textInfo)}
                                $color="#185698"
                                padding="4px"
                            >
                                <CustomInfoIconCountry color="primary" className="info-button" />
                            </StyledIconButton>
                        </ChartTitleRow>
                    ) : null}

                    {visualContent.visualizationId && visualContent.years && visualContent.countries ? (
                        <VisualizationContainer key={visualContent.visualizationId}>
                            <VisualizationPlugin
                                visualizationId={visualContent.visualizationId}
                                visualizationName={visualContent.visualizationName}
                                years={visualContent.years}
                                countries={visualContent.countries}
                                currentCountryOrRegion={visualContent.currentCountryOrRegion}
                                regions={visualContent.regions}
                                withoutBackground
                                useHeaderForCountryOrRegionalPage
                                showDialogInFullScreen={isSmallScreen}
                                onDownloadImage={() => handleOpenScreenshot(visualContent)}
                                analyticsPageTitle={"Regional page"}
                                seriesColors={visualContent.seriesColors}
                                isRegionalPage
                            />
                        </VisualizationContainer>
                    ) : visualContent.visual ? (
                        <img
                            style={{ paddingBlockStart: "8px" }}
                            width="100%"
                            alt={i18n.t(visualContent.title || "Gaps in coverage chart")}
                            src={visualContent.visual}
                        />
                    ) : visualContent.policyCategoryId &&
                      visualContent.countries?.length &&
                      visualContent.years?.length ? (
                        <PolicyExplorerTable
                            title={visualContent.title || ""}
                            categoryId={visualContent.policyCategoryId}
                            countries={visualContent.countries}
                            years={visualContent.years}
                        />
                    ) : null}

                    {visualContent.textBelow && (
                        <TextContainer style={{ marginTop: "12px" }}>
                            <ReactMarkdown components={markdownComponents}>{visualContent.textBelow}</ReactMarkdown>
                        </TextContainer>
                    )}
                </React.Fragment>
            ))}

            {visualTextInfo &&
                (showDialogInFullScreen ? (
                    <FullScreenNotesDialog
                        isOpen={!!visualTextInfo}
                        onClose={() => setVisualTextInfo(undefined)}
                        dialogInfo={visualTextInfo}
                    />
                ) : (
                    <NotesDialog
                        isOpen={!!visualTextInfo}
                        onClose={() => setVisualTextInfo(undefined)}
                        dialogInfo={visualTextInfo}
                    />
                ))}

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
                        regions={currentGraphScreenshot.regions}
                        withoutBackground
                        useHeaderForCountryOrRegionalPage
                        currentCountryOrRegion={currentGraphScreenshot.currentCountryOrRegion}
                        isScreenshot={true}
                        analyticsPageTitle={"Regional page"}
                        seriesColors={currentGraphScreenshot.seriesColors}
                        isRegionalPage
                    />
                </ScreenshotModal>
            ) : null}

            {progressText && (
                <TextContainer>
                    <ReactMarkdown components={markdownComponents}>{progressText}</ReactMarkdown>
                </TextContainer>
            )}
        </Container>
    );
};

const Container = styled.div`
    max-width: 100%;
    padding: 20px 50px 30px 50px;

    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        padding: 30px;
        padding-inline-start: 32px;
    }
`;

const ChartTitleRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 0px;
    align-items: flex-start;
    width: 100%;
    gap: 24px;
    align-items: center;
    justify-content: space-between;
`;

const ChartTitle = styled(Typography)`
    font-family: Lato;
    margin-block-start: 10px;
    margin-block-end: 6px;
    font-size: 1rem;
    font-weight: bold;
    color: ${colors.black};
    white-space: "normal";
    width: 100%;

    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        margin-left: 15px;
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

const StyledIconButton = styled(IconButton)<{ $color: string; padding: string }>`
    padding: ${props => props.padding};
    color: ${props => props.$color};

    svg {
        font-size: 33px;
    }
`;

const CustomInfoIconCountry = styled(InfoIcon)`
    color: ${colors.darkBlue};
    font-size: 25px;
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

const TextContainer = styled.div`
    max-width: 600px;
`;
