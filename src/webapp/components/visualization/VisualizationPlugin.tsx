import { CircularProgress, Typography, useMediaQuery, useTheme } from "@material-ui/core";
import React, { useCallback, useEffect, useRef } from "react";
import styled from "styled-components";
import i18n from "../../../locales";
import { downloadHtmlElement } from "../../utils/downloadHtmlElement";
import { ChartPlugin } from "./ChartPlugin";
import { useChartData } from "./useChartData";
import { VisualizationPluginHeader } from "./VisualizationPluginHeader";
import { useAnalytics } from "../../common/hooks/analytics/useAnalytics";
import { FullScreenDialog } from "../dialog/FullScreenDialog";

const CHART_SCATTER_VISUALIZATION_ID = "kIpnMBaBvZ9";

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
    paddingEnd?: boolean;
    isSquareChart?: boolean;
    visualizationName?: string;
    analyticsPageTitle: string;
    fullScreenInMobile?: boolean;
    onCloseFullScreen?: () => void;
    onLoadingChange?: (loading: boolean) => void;
    forcePluginFullScreen?: boolean;
}

export const VisualizationPlugin: React.FC<VisualizationPluginProps> = React.memo(props => {
    const {
        visualizationId,
        visualizationName,
        years,
        currentCountry,
        countries,
        withoutBackground = false,
        useHeaderForCountryPage = false,
        noDataMessage = "",
        onDownloadImage,
        isScreenshot = false,
        paddingEnd = true,
        isSquareChart = false,
        analyticsPageTitle,
        fullScreenInMobile = false,
        onCloseFullScreen,
        onLoadingChange,
        forcePluginFullScreen = false,
    } = props;

    const { sendEvent } = useAnalytics();
    const { chartData, showInfo, onShowInfo, onCloseInfo, onDownloadExcel } = useChartData(
        visualizationId,
        years,
        countries,
        currentCountry,
        visualizationName
    );
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [openFullScreenDialog, setOpenFullScreenDialog] = React.useState<boolean | undefined>();

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (forcePluginFullScreen && isMobile) {
            setOpenFullScreenDialog(true);
        }
    }, [forcePluginFullScreen, isMobile]);

    useEffect(() => {
        if (chartData.kind === "Loaded" || chartData.kind === "Error") {
            onLoadingChange?.(false);
        } else {
            onLoadingChange?.(true);
        }
    }, [chartData, sendEvent, analyticsPageTitle, onLoadingChange]);

    useEffect(() => {
        if (fullScreenInMobile && isMobile && openFullScreenDialog === undefined) {
            console.debug({ fullScreenInMobile, isMobile, openFullScreenDialog });
            setOpenFullScreenDialog(true);
        }
    }, [fullScreenInMobile, isMobile, openFullScreenDialog]);

    useEffect(() => {
        setOpenFullScreenDialog(undefined);
    }, [visualizationId]);

    const handleCloseFullScreen = React.useCallback(() => {
        setOpenFullScreenDialog(false);
        if (onCloseFullScreen) {
            onCloseFullScreen();
        }
    }, [onCloseFullScreen]);

    const onDirectDownloadImage = useCallback(() => {
        if (chartData.kind === "Loaded" && ref.current) {
            sendEvent({
                name: "file_download",
                pageTitle: analyticsPageTitle,
                contentType: "image",
                contentGroup: "chart",
                contentId: chartData.friendlyName,
            });
            downloadHtmlElement(ref.current, chartData?.friendlyName || "chart-image", {
                backgroundColor: useHeaderForCountryPage ? "white" : "#f1f9fc",
                exclusionClasses: ["download-button", "info-button", "category"],
            });
        }
    }, [chartData, sendEvent, analyticsPageTitle, useHeaderForCountryPage]);

    const downloadExcel = React.useCallback(() => {
        if (chartData.kind === "Loaded") {
            sendEvent({
                name: "file_download",
                pageTitle: analyticsPageTitle,
                contentType: "csv",
                contentGroup: "chart",
                contentId: chartData.friendlyName,
            });
            onDownloadExcel(chartData);
        } else {
            console.error("No data to download");
        }
    }, [analyticsPageTitle, chartData, onDownloadExcel, sendEvent]);

    const handleDownloadImage = React.useCallback(() => {
        if (onDownloadImage) {
            setOpenFullScreenDialog(false);
            onDownloadImage();
        } else {
            onDirectDownloadImage();
        }
    }, [onDownloadImage, onDirectDownloadImage]);

    return chartData.kind === "Loaded" && chartData.analytics.some(analytics => analytics.rows.length > 0) ? (
        <VisualizationPluginContainer
            ref={ref}
            withoutBackground={withoutBackground}
            marginStart={!useHeaderForCountryPage && !isScreenshot}
            paddingEnd={paddingEnd}
            fullscreen={openFullScreenDialog || false}
        >
            <VisualizationPluginHeader
                visualizationDialogInfo={chartData.visualizationDialogInfo || ""}
                visualizationId={visualizationId}
                chartFriendlyName={chartData?.friendlyName}
                categoryTag={chartData?.categoryTag}
                showInfo={showInfo}
                onDownloadExcel={isScreenshot ? undefined : downloadExcel}
                onDownloadImage={isScreenshot ? undefined : handleDownloadImage}
                onShowInfo={isScreenshot ? undefined : onShowInfo}
                onCloseInfo={isScreenshot ? undefined : onCloseInfo}
                useHeaderForCountryPage={useHeaderForCountryPage || (openFullScreenDialog && isMobile)}
                currentCountry={currentCountry}
                countries={chartData.countries}
                showCountryTag={chartData.visualizations[0]?.showCountryTag}
                isScreenshot={isScreenshot}
                reducePaddingBottom={
                    visualizationId === CHART_SCATTER_VISUALIZATION_ID || (openFullScreenDialog && isMobile)
                }
                onClose={openFullScreenDialog && isMobile ? handleCloseFullScreen : undefined}
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
                isSquareChart={isSquareChart}
            />
        </VisualizationPluginContainer>
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
});

type VisualizationPluginContainerProps = {
    children: React.ReactNode;
    fullscreen?: boolean;
    withoutBackground: boolean;
    marginStart: boolean;
    paddingEnd: boolean;
    ref?: React.RefObject<HTMLDivElement>;
};

export const VisualizationPluginContainer: React.FC<VisualizationPluginContainerProps> = React.memo(
    ({ children, fullscreen, withoutBackground, marginStart, paddingEnd, ref }) => {
        return fullscreen ? (
            <FullScreenDialog isOpen={true} forceRotation={true} hasPadding={false}>
                <Container
                    className="VisualizationPlugin-container"
                    ref={ref}
                    $withoutBackground={withoutBackground}
                    $marginStart={false}
                    $paddingEnd={false}
                    $paddingInline={false}
                >
                    {children}
                </Container>
            </FullScreenDialog>
        ) : (
            <Container
                className="VisualizationPlugin-container"
                ref={ref}
                $withoutBackground={withoutBackground}
                $marginStart={marginStart}
                $paddingEnd={paddingEnd}
                $paddingInline={true}
            >
                {children}
            </Container>
        );
    }
);

const Container = styled.div<{
    $withoutBackground: boolean;
    $marginStart?: boolean;
    $paddingEnd?: boolean;
    $paddingInline?: boolean;
}>`
    margin-block-start: ${props => (props.$marginStart ? "25px" : "0px")};
    background: ${props => (props.$withoutBackground ? "white" : "#f1f9fc")};
    padding-block-end: ${props => (props.$paddingEnd ? "16px" : "0px")};
    padding-inline: ${props => (props.$paddingInline ? "16px 32px" : "0")};
    display: flex;
    flex-direction: column;
    height: 100%;
`;

const Center = styled.div`
    height: 200px;
    display: flex;
    position: relative;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
