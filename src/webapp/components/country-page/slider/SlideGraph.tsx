import { Typography } from "@material-ui/core";
import i18n from "../../../../locales";
import styled, { css } from "styled-components";
import { VisualizationPlugin } from "../../visualization/VisualizationPlugin";
import React from "react";
import ScreenshotModal from "../../screenshot-modal/ScreenshotModal";
import { useIndicatorExplorer } from "../../../pages/indicator-explorer/useIndicatorExplorer";

type VisualizationProps = {
    visualizationId: string;
    visualizationName?: string;
    years: string[];
    countries: string[];
    currentCountry?: string;
};

type SlideGraphType = {
    title: string;
    countryId: string;
    graphOne: VisualizationProps;
    graphTwo?: VisualizationProps;
};

export const SlideGraph: React.FC<SlideGraphType> = ({ title, countryId, graphOne, graphTwo }) => {
    const [currentGraphScreenshot, setCurrentGraphScreenshot] = React.useState<VisualizationProps>();

    const handleOpenScreenshot = React.useCallback((graph: VisualizationProps) => {
        setCurrentGraphScreenshot(graph);
    }, []);

    const handleCloseScreenshot = React.useCallback(() => {
        setCurrentGraphScreenshot(undefined);
    }, []);
    const { pageContent } = useIndicatorExplorer();

    return (
        <Container>
            <Typography variant="h3" style={{ marginBottom: "50px", fontWeight: 500, fontSize: "2rem" }}>
                {i18n.t(title)}
            </Typography>
            <VisualizationContainer>
                <VisualizationPlugin
                    visualizationId={(graphOne as VisualizationProps).visualizationId}
                    years={(graphOne as VisualizationProps).years}
                    countries={(graphOne as VisualizationProps).countries}
                    withoutBackground
                    useHeaderForCountryPage
                    currentCountry={(graphOne as VisualizationProps).currentCountry || countryId}
                    onDownloadImage={() => handleOpenScreenshot(graphOne)}
                    noDataMessage={pageContent?.noDataMessage}
                />
            </VisualizationContainer>
            {graphTwo && (
                <VisualizationContainer>
                    <VisualizationPlugin
                        visualizationId={(graphTwo as VisualizationProps).visualizationId}
                        years={(graphTwo as VisualizationProps).years}
                        countries={(graphTwo as VisualizationProps).countries}
                        withoutBackground
                        useHeaderForCountryPage
                        currentCountry={(graphTwo as VisualizationProps).currentCountry || countryId}
                        onDownloadImage={() => handleOpenScreenshot(graphTwo)}
                        noDataMessage={pageContent?.noDataMessage}
                    />
                </VisualizationContainer>
            )}

            {currentGraphScreenshot && (
                <ScreenshotModal
                    open={true}
                    onClose={handleCloseScreenshot}
                    title={currentGraphScreenshot.visualizationName || ""}
                    backgroundColor={"#f1f9fc"}
                >
                    <VisualizationPlugin
                        visualizationId={currentGraphScreenshot.visualizationId}
                        years={currentGraphScreenshot.years}
                        countries={currentGraphScreenshot.countries}
                        withoutBackground
                        useHeaderForCountryPage
                        currentCountry={countryId}
                        isScreenshot={true}
                    />
                </ScreenshotModal>
            )}
        </Container>
    );
};

const visuallyHidden = css`
    position: absolute;
    width: 0.0625rem;
    height: 0.0625rem;
    overflow: hidden;
    white-space: nowrap;
    clip: rect(0 0 0 0);
    clip-path: inset(100%);
`;

const Container = styled.div`
    max-width: 100%;
    padding: 20px 50px 30px 50px;
    @media (min-width: 960px) {
        > h3 {
            ${visuallyHidden};
        }
    }
`;

const VisualizationContainer = styled.div`
    max-width: 100%;
    padding-inline-end: 50px;
`;
