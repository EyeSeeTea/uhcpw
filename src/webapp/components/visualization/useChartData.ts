import { useCallback, useEffect, useState } from "react";
import { Visualization } from "../../../domain/entities/indicator-explorer/Visualization";
import { useAppContext } from "../../contexts/app-context";

import { Analytics } from "../../../domain/entities/indicator-explorer/Analytics";
import { Future, FutureData } from "../../../domain/entities/Future";
import { CompositionRoot } from "../../../CompositionRoot";
import { LegendSet } from "../../../domain/entities/indicator-explorer/LegendSet";
import { ChartData, ChartDataLoaded } from "./ChartData";
import { visualizationCustomizations } from "./customization/visualizationCustomizations";
import { chartOptions, chartOptionsMultiple, ChartSource, ChartSourceMultiple } from "./manual/chartOptions";
import { Country } from "../../../domain/entities/Country";
import { getBreakInSeriesCountryDescription } from "../../../domain/entities/indicator-explorer/BreakInSeries";
import { LatestCOVID19 } from "../../../domain/entities/Year";

interface ChartDataState {
    chartData: ChartData;
    showInfo: boolean;
    onDownloadExcel: (chartDataLoaded: ChartDataLoaded) => void;
    onShowInfo: () => void;
    onCloseInfo: () => void;
}

export function useChartData(
    visualizationId: string,
    years: string[],
    countries: string[],
    currentCountry?: string
): ChartDataState {
    const { compositionRoot } = useAppContext();

    const [chartData, setChartData] = useState<ChartData>({ kind: "Loading" });
    const [showInfo, setShowInfo] = useState<boolean>(false);
    const { countriesAndRegions } = useAppContext();

    const getVisualizationDialogInfo = useCallback(
        (visualization: Visualization, analytics: Analytics, countries: Country[]) => {
            const yearIndexColumn = analytics.headers.findIndex(header => header.name === "pe");

            const allYearsInChart = analytics.rows.reduce((years, row) => {
                if (yearIndexColumn) {
                    const year = row[yearIndexColumn];
                    return year && !years.includes(year) ? [...years, year] : years;
                }

                return years;
            }, []);

            const breakInSeriesDescriptions = countries.reduce<string[]>((descriptions, country) => {
                const description = getBreakInSeriesCountryDescription(
                    visualization.breakInSeries,
                    allYearsInChart,
                    country.id
                );

                if (description) {
                    return [...descriptions, `${country.name}: ${description}`];
                }

                return descriptions;
            }, []);

            if (breakInSeriesDescriptions.length && visualization.notes) {
                return [`${visualization.notes}  \n`, breakInSeriesDescriptions.join("  \n")].join("  \n");
            }

            return breakInSeriesDescriptions.length
                ? breakInSeriesDescriptions.join("  \n")
                : visualization.notes || "";
        },
        []
    );

    useEffect(() => {
        if (visualizationId) {
            const isMultipleVisualizations = visualizationId.includes("_");
            const visualizationIds = isMultipleVisualizations ? visualizationId.split("_") : [visualizationId];

            getChartData(compositionRoot, visualizationIds, years, countries).run(
                ({ visualizations, analytics, legendSets }) => {
                    const visualizationChartOptions = isMultipleVisualizations
                        ? chartOptionsMultiple[visualizationId]
                        : chartOptions[visualizationId];

                    const chartSource = {
                        analyticsResponse: isMultipleVisualizations ? analytics : analytics[0],
                        visualization: isMultipleVisualizations ? visualizations : visualizations[0],
                        countries: countriesAndRegions,
                        currentCountry,
                        currentYear: years.length === 1 ? years[0] : undefined,
                        isLatestCOVID19: years.includes(LatestCOVID19.id),
                    };

                    const visualization = visualizations[0];

                    const visualizationDialogInfo =
                        visualization &&
                        analytics[0] &&
                        getVisualizationDialogInfo(visualization, analytics[0], countriesAndRegions);

                    setChartData({
                        kind: "Loaded",
                        friendlyName:
                            (visualization?.friendlyName &&
                                visualization.friendlyName[0]?.toUpperCase() + visualization.friendlyName.slice(1)) ||
                            "",
                        categoryTag: visualization?.categoryTag || "",
                        visualizations,
                        visualizationDialogInfo,
                        analytics,
                        legendSets,
                        customization: visualizationCustomizations[visualizationId],
                        countries: countriesAndRegions.filter(country => countries.includes(country.id)),
                        chartOptions: visualizationChartOptions
                            ? visualizationChartOptions(chartSource as ChartSourceMultiple & ChartSource)
                            : undefined,
                        isScatter: visualization?.isScatter,
                        xAxis: visualization?.xAxis,
                        yAxis: visualization?.yAxis,
                    });
                },
                error => {
                    setChartData({
                        kind: "Error",
                        message: "An error has ocurred to loading chart data: " + error,
                    });
                }
            );
        } else {
            setChartData({
                kind: "Error",
                message: "Missing visualizationId",
            });
        }
    }, [
        compositionRoot,
        visualizationId,
        countries,
        years,
        countriesAndRegions,
        currentCountry,
        getVisualizationDialogInfo,
    ]);

    const onDownloadExcel = useCallback(
        (chartDataLoaded: ChartDataLoaded) => {
            const seriesData = chartDataLoaded?.chartOptions?.series ?? chartDataLoaded?.customization?.series;
            const seriesIdAndName = (seriesData || []).map(({ id, name }) => ({ id, name }));

            compositionRoot.indicatorExplorer.downloadAnalytics
                .execute({
                    visualizationIds: visualizationId.split("_"),
                    periods: years || [],
                    orgUnits: countries || [],
                    seriesIdAndName: seriesIdAndName,
                    isScatter: chartDataLoaded?.isScatter,
                    xAxis: chartDataLoaded?.xAxis,
                    yAxis: chartDataLoaded?.yAxis,
                })
                .runAsync();
        },
        [compositionRoot.indicatorExplorer.downloadAnalytics, visualizationId, years, countries]
    );

    const onShowInfo = useCallback(() => {
        setShowInfo(true);
    }, []);

    const onCloseInfo = useCallback(() => {
        setShowInfo(false);
    }, []);

    return {
        chartData,
        showInfo,
        onShowInfo,
        onCloseInfo,
        onDownloadExcel,
    };
}

function getChartData(
    compositionRoot: CompositionRoot,
    visualizationIds: string[],
    years: string[],
    countries: string[]
): FutureData<{
    visualizations: Visualization[];
    analytics: Analytics[];
    legendSets: LegendSet[];
}> {
    // Function to fetch data for a single visualizationId
    const fetchDataForId = (visualizationId: string) => {
        return Future.joinObj({
            visualization: compositionRoot.indicatorExplorer.getVisualization.execute(visualizationId),
            analytics: compositionRoot.indicatorExplorer.getAnalytics.execute(
                visualizationId,
                years || [],
                countries || []
            ),
        }).flatMap(({ visualization, analytics }) => {
            const legendSetIds = getLegendSetIds(visualization, analytics);
            return Future.joinObj({
                visualization: Future.success(visualization),
                analytics: Future.success(analytics),
                legendSets: compositionRoot.indicatorExplorer.getLegendSets.execute(legendSetIds),
            });
        });
    };
    // Fetch data for all visualization
    return Future.parallel(visualizationIds.map(fetchDataForId)).map(results => {
        const visualizations = results.map(result => result.visualization);
        const analytics = results.map(result => result.analytics);
        // Flatten the legendSets arrays from each result into a single array
        const legendSets = results.reduce((acc, result) => [...acc, ...result.legendSets], [] as LegendSet[]);

        return {
            visualizations: visualizations,
            analytics: analytics,
            legendSets: legendSets,
        };
    });
}

function getLegendSetIds(visualization: Visualization, analytics: Analytics) {
    // parse responses to extract dx ids from metaData
    // multiple responses are only for YOY which does not support legends or custom icon
    // safe to use only the 1st
    // dx dimensions might not be present, the empty array covers that case
    const dxIds = analytics.metaData.dimensions.dx || [];

    const legendSetIds = [];

    switch (visualization.legend?.strategy) {
        case "FIXED":
            if (visualization.legend?.set?.id) {
                legendSetIds.push(visualization.legend.set.id);
            }
            break;
        case "BY_DATA_ITEM": {
            dxIds.forEach(dxId => {
                const legendSetId = analytics.metaData.items[dxId]?.legendSet;

                if (legendSetId) {
                    legendSetIds.push(legendSetId);
                }
            });

            break;
        }
    }

    return legendSetIds;
}
