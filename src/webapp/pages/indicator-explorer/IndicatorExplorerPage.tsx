import { Typography, useMediaQuery, useTheme } from "@material-ui/core";
import React, { useEffect, useMemo } from "react";
import styled from "styled-components";
import { useSnackbar } from "@eyeseetea/d2-ui-components";

import i18n from "../../../locales";
import { Layout } from "../../components/layout/Layout";
import { IndicatorExplorerFilters } from "../../components/indicator-explorer/IndicatorExplorerFilters";
import { colors } from "../app/themes/dhis2.theme";
import { useIndicatorExplorer } from "./useIndicatorExplorer";
import indicatorExplorer from "../../assets/indicator-explorer.svg";
import { VisualizationPlugin } from "../../components/visualization/VisualizationPlugin";
import { EmptyContent } from "../../components/empty-content/EmptyContent";
import ScreenshotModal from "../../components/screenshot-modal/ScreenshotModal";
import { useAnalytics } from "../../common/hooks/analytics/useAnalytics";
import mapBackground from "../../assets/map-background.jpg";
import { BREAKPOINT_WIDTH_SMALL_SCREEN } from "../../common/hooks/screen/useIsSmallScreen";
import { useHistory } from "react-router-dom";

export const IndicatorExplorerPage: React.FC = React.memo(() => {
    const snackbar = useSnackbar();
    const history = useHistory();

    const filterInParams = useMemo(() => {
        const searchParams = new URLSearchParams(history.location.search);

        return {
            indicator: searchParams.get("indicator") || undefined,
            years: searchParams.get("years")?.split(",") || undefined,
            countriesAndAreas: searchParams.get("countriesAndAreas")?.split(",") || undefined,
        };
    }, [history.location.search]);

    const { filters, onGet, showVisualization, globalMessage, pageContent, closeVisualization } = useIndicatorExplorer(
        filterInParams.indicator,
        filterInParams.years,
        filterInParams.countriesAndAreas
    );
    const { sendPageView } = useAnalytics();

    const [openScreenshot, setOpenScreenshot] = React.useState(false);
    const [chartPluginIsLoading, setChartPluginIsLoading] = React.useState(false);
    const [forcePluginFullScreen, setForcePluginFullScreen] = React.useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        if (!globalMessage) return;

        if (globalMessage?.type === "error") {
            snackbar.error(globalMessage.text);
        } else if (globalMessage?.type === "info") {
            snackbar.info(globalMessage.text, { autoHideDuration: 5000 });
        } else {
            snackbar.success(globalMessage?.text);
        }
    }, [globalMessage, snackbar]);

    useEffect(() => {
        sendPageView({ title: "Indicator explorer" });
    }, [sendPageView]);

    const handleOpenScreenshot = React.useCallback(() => {
        setOpenScreenshot(true);
        setForcePluginFullScreen(false);
    }, []);

    const handleCloseScreenshot = React.useCallback(() => {
        setOpenScreenshot(false);

        if (isMobile) {
            setForcePluginFullScreen(true);
        }
    }, [isMobile]);

    const handlePlugingLoadingChange = React.useCallback((loading: boolean) => {
        setChartPluginIsLoading(loading);
    }, []);

    const chartName = useMemo(
        () => filters.indicators.options.find(o => o.value === filters.indicators.selected)?.text || "",
        [filters.indicators.options, filters.indicators.selected]
    );

    const analyticsContent = useMemo(
        () => ({
            contentGroup: "chart",
            contentId: chartName,
        }),
        [chartName]
    );

    return (
        <Layout>
            <TitleContainer>
                <Typography variant="h3">{i18n.t("Indicator explorer")}</Typography>
                <Image src={indicatorExplorer} alt={i18n.t("indicator explorer")} />
            </TitleContainer>

            <MainSection
                key={`${filters.indicators.selected}-${filters.countryAndRegions.selected?.join(
                    ","
                )}-${filters.year.selected?.join(",")}`}
            >
                <IndicatorExplorerFilters filters={filters} onGetChart={onGet} disableGet={chartPluginIsLoading} />

                {showVisualization && filters.indicators.selected ? (
                    <VisualizationPlugin
                        visualizationId={filters.indicators.selected}
                        years={filters.year.selected || []}
                        countries={filters.countryAndRegions.selectedCountriesAndSubregions || []}
                        regions={filters.countryAndRegions.selectedRegions || []}
                        noDataMessage={pageContent?.noDataMessage}
                        onDownloadImage={handleOpenScreenshot}
                        isSquareChart={filters.indicators.selected === "kIpnMBaBvZ9"}
                        analyticsPageTitle="Indicator explorer"
                        onLoadingChange={handlePlugingLoadingChange}
                        fullScreenInMobile={true}
                        onCloseFullScreen={closeVisualization}
                        forcePluginFullScreen={forcePluginFullScreen}
                    />
                ) : (
                    <EmptyContent info={pageContent?.selectCategory} />
                )}

                <ScreenshotModal
                    open={openScreenshot}
                    onClose={handleCloseScreenshot}
                    title={chartName}
                    backgroundColor={"#f1f9fc"}
                    isSquareChart={filters.indicators.selected === "kIpnMBaBvZ9"}
                    analyticsPageTitle="Indicator explorer"
                    analyticsContent={analyticsContent}
                    forceRotation={isMobile}
                >
                    <VisualizationPlugin
                        visualizationId={filters.indicators.selected || ""}
                        years={filters.year.selected || []}
                        countries={filters.countryAndRegions.selectedCountriesAndSubregions || []}
                        regions={filters.countryAndRegions.selectedRegions || []}
                        noDataMessage={pageContent?.noDataMessage}
                        isScreenshot={true}
                        withoutBackground
                        isSquareChart={filters.indicators.selected === "kIpnMBaBvZ9"}
                        analyticsPageTitle="Indicator explorer"
                    />
                </ScreenshotModal>
            </MainSection>
        </Layout>
    );
});

const MainSection = styled.div`
    background: white;
    padding: 48px 64px;
    @media (max-width: 600px) {
        padding: 34px 64px;
    }
`;

const TitleContainer = styled.div`
    background: ${colors.gradientPrimary};
    color: white;
    padding: 24px 200px 24px 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    @media (max-width: ${BREAKPOINT_WIDTH_SMALL_SCREEN}px) {
        background: ${props => props.color} url(${mapBackground});
        background-position: center;
    }
`;

const Image = styled.img`
    height: 56px;
`;
