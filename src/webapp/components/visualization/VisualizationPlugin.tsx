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
}

export const VisualizationPlugin: React.FC<VisualizationPluginProps> = React.memo(
    ({
        visualizationId,
        years,
        currentCountry,
        countries,
        withoutBackground = false,
        useHeaderForCountryPage = false,
    }) => {
        const { chartData, showInfo, onShowInfo, onCloseInfo, onDownloadExcel } = useChartData(
            visualizationId,
            years,
            countries,
            currentCountry
        );

        const ref = useRef<HTMLDivElement>(null);

        const onDownloadImage = useCallback(() => {
            if (chartData.kind === "Loaded" && ref.current) {
                downloadHtmlElement(ref.current, chartData.visualization.friendlyName || "chart-image", {
                    backgroundColor: useHeaderForCountryPage ? "white" : "#f1f9fc",
                    exclusionClasses: ["download-button", "info-button", "category"],
                });
            }
        }, [chartData, useHeaderForCountryPage]);

        return chartData.kind === "Loaded" && chartData.analytics.rows.length > 0 ? (
            <Container ref={ref} $withoutBackground={withoutBackground}>
                <VisualizationPluginHeader
                    visualizationDialogInfo={chartData.visualization.info}
                    chartFriendlyName={chartData.visualization.friendlyName}
                    categoryTag={chartData.visualization.categoryTag}
                    showInfo={showInfo}
                    onDownloadExcel={onDownloadExcel}
                    onDownloadImage={onDownloadImage}
                    onShowInfo={onShowInfo}
                    onCloseInfo={onCloseInfo}
                    useHeaderForCountryPage={useHeaderForCountryPage}
                />
                <ChartPlugin
                    analytics={[chartData.analytics]}
                    visualization={chartData.visualization}
                    legendSets={chartData.legendSets}
                    customizedOptions={chartData.customization}
                    countries={chartData.countries}
                    withoutBackground={withoutBackground}
                    externalchartOptions={chartData.chartOptions}
                />
                <Box height={32} />
            </Container>
        ) : chartData.kind === "Loaded" && chartData.analytics.rows.length === 0 ? (
            <Center>
                <Typography variant="subtitle1">{i18n.t("There may be no data")}</Typography>
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

const Container = styled.div<{ $withoutBackground: boolean }>`
    margin-top: 48px;
    background: ${props => (props.$withoutBackground ? "white" : "#f1f9fc")};
    padding: 0px 32px 32px 32px;
`;

const Center = styled.div`
    height: 200px;
    display: flex;
    position: relative;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
