import { Typography } from "@material-ui/core";
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

export const IndicatorExplorerPage: React.FC = React.memo(() => {
    const snackbar = useSnackbar();

    const { filters, onGet, showVisualization, globalMessage, pageContent } = useIndicatorExplorer();
    const { sendPageView } = useAnalytics();

    const [openScreenshot, setOpenScreenshot] = React.useState(false);

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
    }, []);

    const handleCloseScreenshot = React.useCallback(() => {
        setOpenScreenshot(false);
    }, []);

    const chartName = useMemo(
        () => filters.indicators.options.find(o => o.value === filters.indicators.selected)?.text || "",
        [filters.indicators.options, filters.indicators.selected]
    );

    return (
        <Layout>
            <TitleContainer>
                <Typography variant="h3">{i18n.t("Indicator explorer")}</Typography>
                <Image src={indicatorExplorer} alt={i18n.t("indicator explorer")} />
            </TitleContainer>

            <MainSection>
                <IndicatorExplorerFilters filters={filters} onGetChart={onGet} />

                {showVisualization && filters.indicators.selected ? (
                    <VisualizationPlugin
                        visualizationId={filters.indicators.selected}
                        years={filters.year.selected || []}
                        countries={filters.country.selected || []}
                        noDataMessage={pageContent?.noDataMessage}
                        onDownloadImage={handleOpenScreenshot}
                        isSquareChart={filters.indicators.selected === "kIpnMBaBvZ9"}
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
                    analyticsEventTitle="Indicator explorer"
                >
                    <VisualizationPlugin
                        visualizationId={filters.indicators.selected || ""}
                        years={filters.year.selected || []}
                        countries={filters.country.selected || []}
                        noDataMessage={pageContent?.noDataMessage}
                        isScreenshot={true}
                        withoutBackground
                        isSquareChart={filters.indicators.selected === "kIpnMBaBvZ9"}
                    />
                </ScreenshotModal>
            </MainSection>
        </Layout>
    );
});

const MainSection = styled.div`
    background: white;
    padding: 48px 64px;
`;

const TitleContainer = styled.div`
    background: ${colors.gradientPrimary};
    color: white;
    padding: 48px 200px 48px 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
`;

const Image = styled.img`
    width: 160px;
    height: 160px;
`;
