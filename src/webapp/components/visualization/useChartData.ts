import { useCallback, useEffect, useState } from "react";
import { Visualization } from "../../../domain/entities/indicator-explorer/Visualization";
import { useAppContext } from "../../contexts/app-context";

import { Analytics } from "../../../domain/entities/indicator-explorer/Analytics";
import { Future, FutureData } from "../../../domain/entities/Future";
import { CompositionRoot } from "../../../CompositionRoot";
import { LegendSet } from "../../../domain/entities/indicator-explorer/LegendSet";
import { ChartData, ChartDataLoaded } from "./ChartData";
import { visualizationCustomizations } from "./customization/visualizationCustomizations";
import { chartOptions } from "./manual/chartOptions";
import { Country } from "../../../domain/entities/Country";

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
                const yearsBeforeBreak = (visualization.breakInSeries?.countries.get(country.id)?.years || []).map(
                    year => (Number(year) - 1).toString()
                );
                const areYearsBeforeBreakInChart = yearsBeforeBreak.some(year => allYearsInChart.includes(year));

                if (areYearsBeforeBreakInChart && visualization.breakInSeries?.countries.get(country.id)?.description) {
                    return [
                        ...descriptions,
                        `${country.name}: ${visualization.breakInSeries?.countries.get(country.id)?.description}`,
                    ];
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
            getChartData(compositionRoot, visualizationId, years, countries).run(
                ({ visualization, analytics, legendSets }) => {
                    const visualizationChartOptions = chartOptions[visualizationId];

                    setChartData({
                        kind: "Loaded",
                        visualization: {
                            ...visualization,
                            friendlyName: visualization.friendlyName
                                ? `${visualization.friendlyName
                                      .charAt(0)
                                      .toUpperCase()}${visualization.friendlyName.slice(1)}`
                                : visualization.friendlyName,
                        },
                        visualizationDialogInfo: getVisualizationDialogInfo(
                            visualization,
                            analytics,
                            countriesAndRegions
                        ),
                        analytics,
                        legendSets,
                        customization: visualizationCustomizations[visualizationId],
                        countries: countriesAndRegions.filter(country => countries.includes(country.id)),
                        chartOptions: visualizationChartOptions
                            ? visualizationChartOptions({
                                  analyticsResponse: analytics,
                                  visualization,
                                  countries: countriesAndRegions,
                                  currentCountry,
                              })
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
    visualizationId: string,
    years: string[],
    countries: string[]
): FutureData<{
    visualization: Visualization;
    analytics: Analytics;
    legendSets: LegendSet[];
}> {
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
