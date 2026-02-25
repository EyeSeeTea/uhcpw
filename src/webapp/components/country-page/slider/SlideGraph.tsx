import { Typography } from "@material-ui/core";
import ReactMarkdown, { Components } from "react-markdown";
import styled, { css } from "styled-components";
import React from "react";

import i18n from "../../../../locales";
import { VisualizationPlugin } from "../../visualization/VisualizationPlugin";
import ScreenshotModal from "../../screenshot-modal/ScreenshotModal";
import { useIndicatorExplorer } from "../../../pages/indicator-explorer/useIndicatorExplorer";
import { BREAKPOINT_WIDTH_SMALL_SCREEN, useIsSmallScreen } from "../../../common/hooks/screen/useIsSmallScreen";
import { Id } from "../../../../domain/entities/Ref";
import { colors } from "../../../pages/app/themes/dhis2.theme";
import { useAnalytics } from "../../../common/hooks/analytics/useAnalytics";
import { useSyncedGraphs } from "./useSyncedGraphs";

type VisualizationProps = {
    visualizationId: string;
    visualizationName?: string;
    text?: string;
    years: string[];
    countries: Id[];
    regions: Id[];
    currentCountryOrRegion?: Id;
    filterByLatestAvailableYearInRegion?: boolean;
    needToKnowLatestAvailableYearInChart?: boolean;
    visualizationIdInIndicatorExplorer?: Id;
    yearsInIndicatorExplorer?: string[];
    sharedYAxisMax?: number;
    filterByLatestAvailableYearInEURegion?: boolean;
    euRegionId?: Id;
};

type SlideGraphType = {
    title?: string;
    countryId: string;
    graphs: VisualizationProps[];
    isRegionalPage?: boolean;
    hasNarrowerText?: boolean;
    isSyncGraphs?: boolean;
};

export const SlideGraph: React.FC<SlideGraphType> = ({
    title,
    countryId,
    graphs,
    isRegionalPage = false,
    hasNarrowerText = false,
    isSyncGraphs,
}) => {
    const isSmallScreen = useIsSmallScreen();
    const { redirectWithExternalLink } = useAnalytics();
    const syncGraphsState = useSyncedGraphs(isSyncGraphs);

    const [currentGraphScreenshot, setCurrentGraphScreenshot] = React.useState<VisualizationProps>();

    const markdownComponents: Components = React.useMemo(
        () => ({
            p: ({ children }) => (
                <Paragraph variant="body1" gutterBottom>
                    {children}
                </Paragraph>
            ),
            li: ({ children, ...props }) => <StyledLi {...props}>{children} </StyledLi>,
            ul: ({ children, ...props }) => <StyledUl {...props}>{children}</StyledUl>,
            a: ({ ...props }) => (
                <TextLink href={props.href} target="_blank" rel="noreferrer" onClick={redirectWithExternalLink}>
                    {props.children}
                </TextLink>
            ),
        }),
        [redirectWithExternalLink]
    );

    const handleOpenScreenshot = React.useCallback((graph: VisualizationProps) => {
        setCurrentGraphScreenshot(graph);
    }, []);

    const handleCloseScreenshot = React.useCallback(() => {
        setCurrentGraphScreenshot(undefined);
    }, []);
    const { pageContent } = useIndicatorExplorer();

    const analyticsContent = React.useMemo(
        () => ({
            contentGroup: "chart",
            contentId: currentGraphScreenshot?.visualizationName,
        }),
        [currentGraphScreenshot?.visualizationName]
    );

    return (
        <Container $isRegionalPage={isRegionalPage}>
            {title && <StyledGraphTitle variant="h3">{i18n.t(title)}</StyledGraphTitle>}

            {graphs.length > 0
                ? graphs.map((graph, graphIndex) => (
                      <VisualizationContainer key={graph.visualizationId} $hasMargin={graphIndex !== 0}>
                          {graph.text && (
                              <TextContainer hasNarrowerText={hasNarrowerText}>
                                  <ReactMarkdown components={markdownComponents}>{graph.text}</ReactMarkdown>
                              </TextContainer>
                          )}

                          <VisualizationPlugin
                              visualizationId={graph.visualizationId}
                              visualizationName={graph.visualizationName}
                              years={graph.years}
                              countries={graph.countries}
                              regions={graph.regions}
                              withoutBackground
                              useHeaderForCountryOrRegionalPage
                              currentCountryOrRegion={graph.currentCountryOrRegion || countryId}
                              onDownloadImage={() => handleOpenScreenshot(graph)}
                              noDataMessage={pageContent?.noDataMessage}
                              analyticsPageTitle={isRegionalPage ? "Regional page" : "Country page"}
                              showDialogInFullScreen={isSmallScreen}
                              isRegionalPage={isRegionalPage}
                              filterByLatestAvailableYearInRegion={graph.filterByLatestAvailableYearInRegion}
                              filterByLatestAvailableYearInEURegion={graph.filterByLatestAvailableYearInEURegion}
                              euRegionId={graph.euRegionId}
                              needToKnowLatestAvailableYearInChart={graph.needToKnowLatestAvailableYearInChart}
                              visualizationIdInIndicatorExplorer={graph.visualizationIdInIndicatorExplorer}
                              yearsInIndicatorExplorer={graph.yearsInIndicatorExplorer}
                              syncGraphsState={syncGraphsState}
                          />
                      </VisualizationContainer>
                  ))
                : null}

            {currentGraphScreenshot && (
                <ScreenshotModal
                    open={true}
                    onClose={handleCloseScreenshot}
                    title={currentGraphScreenshot.visualizationName || ""}
                    backgroundColor={"#f1f9fc"}
                    analyticsPageTitle={isRegionalPage ? "Regional page" : "Country page"}
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
                        currentCountryOrRegion={currentGraphScreenshot.currentCountryOrRegion || countryId}
                        isScreenshot={true}
                        analyticsPageTitle={isRegionalPage ? "Regional page" : "Country page"}
                        filterByLatestAvailableYearInRegion={currentGraphScreenshot.filterByLatestAvailableYearInRegion}
                        filterByLatestAvailableYearInEURegion={
                            currentGraphScreenshot.filterByLatestAvailableYearInEURegion
                        }
                        euRegionId={currentGraphScreenshot.euRegionId}
                        needToKnowLatestAvailableYearInChart={
                            currentGraphScreenshot.needToKnowLatestAvailableYearInChart
                        }
                        visualizationIdInIndicatorExplorer={currentGraphScreenshot.visualizationIdInIndicatorExplorer}
                        isRegionalPage={isRegionalPage}
                        syncGraphsState={syncGraphsState}
                    />
                </ScreenshotModal>
            )}
        </Container>
    );
};

const Container = styled.div<{ $isRegionalPage?: boolean }>`
    max-width: 100%;
    padding: 20px 50px 30px 50px;
    padding-inline: ${props => (props.$isRegionalPage ? "30px" : "50px")};

    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        padding: 30px;
        padding-inline-start: 16px;
    }

    ${props =>
        props.$isRegionalPage &&
        css`
            & > div {
                :not(:last-child) {
                    margin-block-end: 20px;
                }
                & > div {
                    :not(:last-child) {
                        margin-block-end: 20px;
                    }
                }

                .VisualizationPlugin-container {
                    padding-block-end: 0;

                    & .visualization-plugin-header {
                        padding: 0;
                    }
                }
            }
        `}
`;

const VisualizationContainer = styled.div<{ $hasMargin?: boolean; $isRegionalPage?: boolean }>`
    max-width: 100%;
    padding-inline-end: ${props => (props.$isRegionalPage ? "0px" : "50px")};
    display: block;

    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        padding: 0;
        margin-block-start: ${props => (props.$hasMargin ? "20px" : "0")};

        > div {
            padding: 0;
        }
    }
`;

const StyledTypography = styled(Typography)`
    color: black;
`;

const StyledGraphTitle = styled(StyledTypography)`
    margin-bottom: 50px;
    font-weight: 500;
    font-size: 2rem;
`;

const Paragraph = styled(Typography)`
    font-family: Lato;
    margin-block: 10px;
    margin-inline-start: 36px;
    font-size: 16px;
    color: ${colors.black};

    &:first-child {
        margin-block-start: 0;
    }

    &:last-child {
        margin-block-end: 0;
    }

    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        margin-inline-start: 16px;
    }
`;

const StyledLi = styled.li`
    line-height: 1.43;
    font-size: 16px;
    color: ${colors.black};
`;

const StyledUl = styled.ul`
    padding-inline-start: 14px;
    font-size: 16px;
    color: ${colors.black};
`;

const TextContainer = styled.div<{ hasNarrowerText?: boolean }>`
    max-width: ${props => (props.hasNarrowerText ? "600px" : "100%")};

    p:has(+ ul) {
        margin-bottom: 0;
    }

    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        max-width: 100%;
    }
`;

const TextLink = styled.a`
    color: ${colors.accentPrimary};
    text-transform: none;
    text-decoration: none;
    &:hover {
        text-decoration: underline;
    }
`;
