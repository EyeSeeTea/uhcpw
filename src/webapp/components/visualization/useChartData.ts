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
                    };

                    setChartData({
                        kind: "Loaded",
                        visualizations, // TODO maybe handle friendly names here
                        analytics,
                        legendSets,
                        customization: visualizationCustomizations[visualizationId],
                        countries: countriesAndRegions.filter(country => countries.includes(country.id)),
                        chartOptions: visualizationChartOptions
                            ? visualizationChartOptions(chartSource as ChartSourceMultiple & ChartSource)
                            : undefined,
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
    }, [compositionRoot, visualizationId, countries, years, countriesAndRegions, currentCountry]);

    const onDownloadExcel = useCallback(
        (chartDataLoaded: ChartDataLoaded) => {
            const seriesData = chartDataLoaded?.chartOptions?.series ?? chartDataLoaded?.customization?.series;
            const seriesIdAndName = (seriesData || []).map(({ id, name }) => ({ id, name }));

            compositionRoot.indicatorExplorer.downloadAnalytics
                .execute({
                    visualizationId,
                    periods: years || [],
                    orgUnits: countries || [],
                    seriesIdAndName: seriesIdAndName,
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

    return { chartData, showInfo, onShowInfo, onCloseInfo, onDownloadExcel };
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
