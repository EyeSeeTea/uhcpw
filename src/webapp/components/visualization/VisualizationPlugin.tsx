import { Box, CircularProgress, Typography } from "@material-ui/core";
import React, { useCallback, useRef } from "react";
import styled from "styled-components";
import i18n from "../../../locales";
import { downloadHtmlElement } from "../../utils/downloadHtmlElement";
import { ChartPlugin } from "./ChartPlugin";
import { useChartData } from "./useChartData";
import { VisualizationPluginHeader } from "./VisualizationPluginHeader";

interface VisualizationPluginProps {
    visualizationId: string;
    years: string[];
    countries: string[];
    currentCountry?: string;
    withoutBackground?: boolean;
    useHeaderForCountryPage?: boolean;
    noDataMessage?: string;
    onDownloadImage?: () => void;
    isScreenshot?: boolean;
}

export const VisualizationPlugin: React.FC<VisualizationPluginProps> = React.memo(
    ({
        visualizationId,
        years,
        currentCountry,
        countries,
        withoutBackground = false,
        useHeaderForCountryPage = false,
        noDataMessage = "",
        onDownloadImage,
        isScreenshot = false,
    }) => {
        const { chartData, showInfo, onShowInfo, onCloseInfo, onDownloadExcel } = useChartData(
            visualizationId,
            years,
            countries,
            currentCountry
        );

        const ref = useRef<HTMLDivElement>(null);

        const onDirectDownloadImage = useCallback(() => {
            if (chartData.kind === "Loaded" && ref.current) {
                downloadHtmlElement(ref.current, chartData?.friendlyName || "chart-image", {
                    backgroundColor: useHeaderForCountryPage ? "white" : "#f1f9fc",
                    exclusionClasses: ["download-button", "info-button", "category"],
                });
            }
        }, [chartData, useHeaderForCountryPage]);

        return chartData.kind === "Loaded" && chartData.analytics.some(analytics => analytics.rows.length > 0) ? (
            <Container
                className="VisualizationPlugin-container"
                ref={ref}
                $withoutBackground={withoutBackground}
                $marginStart={!useHeaderForCountryPage && !isScreenshot}
            >
                <VisualizationPluginHeader
                    visualizationDialogInfo={chartData.visualizationDialogInfo || ""}
                    chartFriendlyName={chartData?.friendlyName}
                    categoryTag={chartData?.categoryTag}
                    showInfo={showInfo}
                    onDownloadExcel={isScreenshot ? undefined : () => onDownloadExcel(chartData)}
                    onDownloadImage={isScreenshot ? undefined : onDownloadImage || onDirectDownloadImage}
                    onShowInfo={isScreenshot ? undefined : onShowInfo}
                    onCloseInfo={isScreenshot ? undefined : onCloseInfo}
                    useHeaderForCountryPage={useHeaderForCountryPage}
                    currentCountry={currentCountry}
                    countries={chartData.countries}
                    showCountryTag={chartData.visualizations[0]?.showCountryTag}
                    isScreenshot={isScreenshot}
                />
                <ChartPlugin
                    key={`${showInfo}`} // This is to force the re-render of the chart when the info dialog is opened/closed
                    analytics={chartData.analytics}
                    visualizations={chartData.visualizations}
                    legendSets={chartData.legendSets}
                    customizedOptions={chartData.customization}
                    countries={chartData.countries}
                    withoutBackground={withoutBackground}
                    externalchartOptions={chartData.chartOptions}
                />
                {!isScreenshot && <Box height={32} />}
            </Container>
        ) : chartData.kind === "Loaded" && chartData.analytics[0]?.rows.length === 0 ? (
            <Center>
                <Typography variant="subtitle1">
                    {noDataMessage ? noDataMessage : i18n.t("There may be no data")}
                </Typography>
            </Center>
        ) : chartData.kind === "Error" ? (
            <Center>
                <Typography variant="subtitle1">{chartData.message}</Typography>
            </Center>
        ) : (
            <Center>
                <CircularProgress />
            </Center>
        );
    }
);

const Container = styled.div<{ $withoutBackground: boolean; $marginStart?: boolean }>`
    margin-block-start: ${props => (props.$marginStart ? "48px" : "0px")};
    background: ${props => (props.$withoutBackground ? "white" : "#f1f9fc")};
    padding: 0px 32px 32px 16px;
    width: 100%;
`;

const Center = styled.div`
    height: 200px;
    display: flex;
    position: relative;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
