import { Typography } from "@material-ui/core";
import i18n from "../../../../locales";
import styled from "styled-components";
import { VisualizationPlugin } from "../../visualization/VisualizationPlugin";
import React from "react";
import ScreenshotModal from "../../screenshot-modal/ScreenshotModal";
import { useIndicatorExplorer } from "../../../pages/indicator-explorer/useIndicatorExplorer";
import { BREAKPOINT_WIDTH_SMALL_SCREEN, useIsSmallScreen } from "../../../common/hooks/screen/useIsSmallScreen";
import { Id } from "../../../../domain/entities/Ref";

type VisualizationProps = {
    visualizationId: string;
    visualizationName?: string;
    years: string[];
    countries: string[];
    currentCountryOrRegion?: Id;
};

type SlideGraphType = {
    title: string;
    countryId: string;
    graphOne: VisualizationProps;
    graphTwo?: VisualizationProps;
    isMobile?: boolean;
};

export const SlideGraph: React.FC<SlideGraphType> = ({ title, countryId, graphOne, graphTwo, isMobile = false }) => {
    const isSmallScreen = useIsSmallScreen();

    const [currentGraphScreenshot, setCurrentGraphScreenshot] = React.useState<VisualizationProps>();

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
        <Container>
            {!isMobile && (
                <StyledTypography variant="h3" style={{ marginBottom: "50px", fontWeight: 500, fontSize: "2rem" }}>
                    {i18n.t(title)}
                </StyledTypography>
            )}
            <VisualizationContainer>
                <VisualizationPlugin
                    visualizationId={(graphOne as VisualizationProps).visualizationId}
                    visualizationName={(graphOne as VisualizationProps).visualizationName}
                    years={(graphOne as VisualizationProps).years}
                    countries={(graphOne as VisualizationProps).countries}
                    withoutBackground
                    useHeaderForCountryPage
                    currentCountryOrRegion={(graphOne as VisualizationProps).currentCountryOrRegion || countryId}
                    onDownloadImage={() => handleOpenScreenshot(graphOne)}
                    noDataMessage={pageContent?.noDataMessage}
                    analyticsPageTitle="Country page"
                    showDialogInFullScreen={isSmallScreen}
                />
            </VisualizationContainer>
            {graphTwo && (
                <VisualizationContainer $hasMargin={true}>
                    <VisualizationPlugin
                        visualizationId={(graphTwo as VisualizationProps).visualizationId}
                        visualizationName={(graphTwo as VisualizationProps).visualizationName}
                        years={(graphTwo as VisualizationProps).years}
                        countries={(graphTwo as VisualizationProps).countries}
                        withoutBackground
                        useHeaderForCountryPage
                        currentCountryOrRegion={(graphTwo as VisualizationProps).currentCountryOrRegion || countryId}
                        onDownloadImage={() => handleOpenScreenshot(graphTwo)}
                        noDataMessage={pageContent?.noDataMessage}
                        analyticsPageTitle="Country page"
                        showDialogInFullScreen={isSmallScreen}
                    />
                </VisualizationContainer>
            )}

            {currentGraphScreenshot && (
                <ScreenshotModal
                    open={true}
                    onClose={handleCloseScreenshot}
                    title={currentGraphScreenshot.visualizationName || ""}
                    backgroundColor={"#f1f9fc"}
                    analyticsPageTitle="Country page"
                    analyticsContent={analyticsContent}
                    forceRotation={isSmallScreen}
                >
                    <VisualizationPlugin
                        visualizationId={currentGraphScreenshot.visualizationId}
                        visualizationName={currentGraphScreenshot.visualizationName}
                        years={currentGraphScreenshot.years}
                        countries={currentGraphScreenshot.countries}
                        withoutBackground
                        useHeaderForCountryPage
                        currentCountryOrRegion={countryId}
                        isScreenshot={true}
                        analyticsPageTitle="Country page"
                    />
                </ScreenshotModal>
            )}
        </Container>
    );
};

const Container = styled.div`
    max-width: 100%;
    padding: 20px 50px 30px 50px;

    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        padding: 30px;
        padding-inline-start: 0px;
    }
`;

const VisualizationContainer = styled.div<{ $hasMargin?: boolean }>`
    max-width: 100%;
    padding-inline-end: 50px;

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
