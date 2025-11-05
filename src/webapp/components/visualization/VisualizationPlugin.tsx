import { CircularProgress, Typography, useMediaQuery, useTheme } from "@material-ui/core";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import i18n from "../../../locales";
import { downloadHtmlElement } from "../../utils/downloadHtmlElement";
import { ChartPlugin } from "./ChartPlugin";
import { useChartData } from "./useChartData";
import { VisualizationPluginHeader } from "./VisualizationPluginHeader";
import { useAnalytics } from "../../common/hooks/analytics/useAnalytics";
import { FullScreenDialog } from "../dialog/FullScreenDialog";
import { Id } from "../../../domain/entities/Ref";
import { useHistory } from "react-router-dom";

const CHART_SCATTER_VISUALIZATION_ID = "kIpnMBaBvZ9";

const EMPTY_REGIONS: Id[] = [];

interface VisualizationPluginProps {
    visualizationId: string;
    years: string[];
    countries: Id[];
    regions?: Id[];
    currentCountryOrRegion?: Id;
    withoutBackground?: boolean;
    useHeaderForCountryOrRegionalPage?: boolean;
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
    showDialogInFullScreen?: boolean;
    isRegionalPage?: boolean;
    filterByLatestAvailableYearInRegion?: boolean;
    visualizationIdInIndicatorExplorer?: Id;
    setChartWithNoData?: (visualizationId: string) => void;
}

export const VisualizationPlugin: React.FC<VisualizationPluginProps> = React.memo(props => {
    const {
        visualizationId,
        visualizationName,
        years,
        currentCountryOrRegion,
        countries,
        regions = EMPTY_REGIONS,
        withoutBackground = false,
        useHeaderForCountryOrRegionalPage = false,
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
        showDialogInFullScreen = false,
        isRegionalPage = false,
        filterByLatestAvailableYearInRegion = false,
        visualizationIdInIndicatorExplorer,
        setChartWithNoData,
    } = props;

    const history = useHistory();
    const { sendEvent } = useAnalytics();
    const { chartData, showInfo, onShowInfo, onCloseInfo, onDownloadExcel } = useChartData({
        visualizationId,
        years,
        countryIds: countries,
        regionIds: regions,
        currentCountryOrRegion,
        visualizationName,
        filterByLatestAvailableYearInRegion,
        isRegionalPage,
    });
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
                backgroundColor: useHeaderForCountryOrRegionalPage ? "white" : "#f1f9fc",
                exclusionClasses: ["download-button", "info-button", "category"],
            });
        }
    }, [chartData, sendEvent, analyticsPageTitle, useHeaderForCountryOrRegionalPage]);

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

    const yearsFilteredInChart = useMemo(() => {
        if (filterByLatestAvailableYearInRegion && chartData.kind === "Loaded") {
            return chartData?.lastAvailableYearInRegion ? [chartData?.lastAvailableYearInRegion] : [];
        }
        return years;
    }, [chartData, filterByLatestAvailableYearInRegion, years]);

    const goToIndicatorExplorer = useCallback(() => {
        if (chartData.kind === "Loaded" && yearsFilteredInChart.length > 0 && countries.length > 0) {
            const visualizationInIndicatorExplorer = visualizationIdInIndicatorExplorer || visualizationId;
            history.push(
                `/indicator-explorer?indicator=${visualizationInIndicatorExplorer}&countriesAndAreas=${[
                    ...countries,
                    ...regions,
                ]}&years=${yearsFilteredInChart}&showChartByDefault=true`
            );
        }
    }, [
        chartData,
        countries,
        regions,
        history,
        visualizationId,
        yearsFilteredInChart,
        visualizationIdInIndicatorExplorer,
    ]);

    const chartHasData = useMemo(() => {
        return (
            chartData.kind === "Loaded" &&
            chartData.analytics.some(analytics => analytics.rows.length > 0) &&
            yearsFilteredInChart.length > 0
        );
    }, [chartData, yearsFilteredInChart]);

    useEffect(() => {
        if (chartData.kind === "Loaded" && setChartWithNoData && !chartHasData) {
            setChartWithNoData(visualizationId);
        }
    }, [chartData.kind, chartHasData, setChartWithNoData, visualizationId]);

    return chartData.kind === "Loaded" && chartHasData ? (
        <VisualizationPluginContainer
            ref={ref}
            withoutBackground={withoutBackground}
            marginStart={!useHeaderForCountryOrRegionalPage && !isScreenshot}
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
                useHeaderForCountryOrRegionalPage={
                    useHeaderForCountryOrRegionalPage || (openFullScreenDialog && isMobile)
                }
                currentCountryOrRegion={currentCountryOrRegion}
                countries={chartData.countries}
                showCountryTag={chartData.visualizations[0]?.showCountryTag}
                isScreenshot={isScreenshot}
                reducePaddingBottom={
                    visualizationId === CHART_SCATTER_VISUALIZATION_ID || (openFullScreenDialog && isMobile)
                }
                onClose={openFullScreenDialog && isMobile ? handleCloseFullScreen : undefined}
                showDialogInFullScreen={openFullScreenDialog || showDialogInFullScreen}
                isRegionalPage={isRegionalPage}
                goToIndicatorExplorer={goToIndicatorExplorer}
            />
            <ChartPlugin
                key={`${showInfo}`} // This is to force the re-render of the chart when the info dialog is opened/closed
                analytics={chartData.analytics}
                visualizations={chartData.visualizations}
                legendSets={chartData.legendSets}
                customizedOptions={chartData.customization}
                countries={chartData.countries}
                regions={chartData.regions}
                withoutBackground={withoutBackground}
                externalchartOptions={chartData.chartOptions}
                isSquareChart={isSquareChart}
                isMobile={isMobile}
            />
        </VisualizationPluginContainer>
    ) : chartData.kind === "Loaded" &&
      (chartData.analytics[0]?.rows.length === 0 || yearsFilteredInChart.length === 0) ? (
        <Center>
            <StyledTypography variant="subtitle1">
                {noDataMessage ? noDataMessage : i18n.t("There may be no data")}
            </StyledTypography>
        </Center>
    ) : chartData.kind === "Error" ? (
        <Center>
            <StyledTypography variant="subtitle1">{chartData.message}</StyledTypography>
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
            <FullScreenDialog isOpen={true} forceRotation={true} hasPadding={false} recalculateHeight>
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
    height: 520px;
    display: flex;
    position: relative;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const StyledTypography = styled(Typography)`
    color: black;
`;
