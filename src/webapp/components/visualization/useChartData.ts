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
import { LatestAvailable, LatestCOVID19 } from "../../../domain/entities/Year";
import { Id } from "../../../domain/entities/Ref";
import { Region } from "../../../domain/entities/region/Region";
import { filterZeroValuesAnalytics } from "../../../domain/entities/indicator-explorer/utils/filterZeroValuesAnalytics";

interface ChartDataState {
    chartData: ChartData;
    showInfo: boolean;
    onDownloadExcel: (chartDataLoaded: ChartDataLoaded) => void;
    onShowInfo: () => void;
    onCloseInfo: () => void;
}

export function useChartData(params: {
    visualizationId: string;
    years: string[];
    countryIds: Id[];
    regionIds: Id[];
    currentCountryOrRegion?: Id;
    visualizationName?: string;
    filterByLatestAvailableYearInRegion?: boolean;
    needToKnowLatestAvailableYearInChart?: boolean;
    isRegionalPage?: boolean;
    seriesColors?: Record<string, string>;
}): ChartDataState {
    const {
        visualizationId,
        years,
        countryIds,
        regionIds,
        currentCountryOrRegion,
        visualizationName,
        filterByLatestAvailableYearInRegion,
        needToKnowLatestAvailableYearInChart,
        isRegionalPage,
        seriesColors,
    } = params;
    const { compositionRoot } = useAppContext();

    const [chartData, setChartData] = useState<ChartData>({ kind: "Loading" });
    const [showInfo, setShowInfo] = useState<boolean>(false);
    const { countriesAndSubregions, regions } = useAppContext();

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
            const selectedRegions = regions.filter(region => regionIds.includes(region.id));

            getChartData(compositionRoot, visualizationIds, years, countryIds, selectedRegions).run(
                ({ visualizations, analytics, legendSets }) => {
                    const visualization = visualizations[0];
                    const needsToFilterZeroValues = visualization?.needsToFilterZeroValues;

                    const filteredAnalytics = needsToFilterZeroValues
                        ? filterZeroValuesAnalytics(analytics)
                        : analytics;

                    const visualizationChartOptions = isMultipleVisualizations
                        ? chartOptionsMultiple[visualizationId]
                        : chartOptions[visualizationId];

                    const isLatestYearAvailable = years.includes(LatestAvailable.id);

                    const lastAvailableYearInRegion =
                        filterByLatestAvailableYearInRegion && currentCountryOrRegion
                            ? getLastAvailableYearInRegion(
                                  filteredAnalytics,
                                  isMultipleVisualizations,
                                  currentCountryOrRegion
                              )
                            : undefined;

                    const lastAvailableYearInChart = needToKnowLatestAvailableYearInChart
                        ? getLastAvailableYearInChartData(filteredAnalytics, isMultipleVisualizations)
                        : undefined;

                    const isLatestCOVID19 = years.includes(LatestCOVID19.id);
                    const chartSource = {
                        analyticsResponse: isMultipleVisualizations ? filteredAnalytics : filteredAnalytics[0],
                        visualization: isMultipleVisualizations ? visualizations : visualization,
                        countries: countriesAndSubregions,
                        regions: regions,
                        currentCountryOrRegion: currentCountryOrRegion,
                        currentYear: years.length === 1 ? years[0] : undefined,
                        isLatestCOVID19: isLatestCOVID19,
                        isLatestYearAvailable: isLatestYearAvailable,
                        yearToFilterBy: lastAvailableYearInRegion,
                        isRegionalPage: isRegionalPage,
                        seriesColors: seriesColors,
                    } as ChartSourceMultiple & ChartSource;

                    const visualizationDialogInfo =
                        visualization &&
                        filteredAnalytics[0] &&
                        getVisualizationDialogInfo(visualization, filteredAnalytics[0], countriesAndSubregions);

                    const chartName =
                        visualizationName && visualizationName[0]?.toUpperCase() + visualizationName.slice(1);

                    setChartData({
                        kind: "Loaded",
                        friendlyName: chartName
                            ? chartName
                            : (visualization?.friendlyName &&
                                  visualization.friendlyName[0]?.toUpperCase() + visualization.friendlyName.slice(1)) ||
                              "",
                        categoryTag: visualization?.categoryTag || "",
                        visualizations,
                        visualizationDialogInfo,
                        analytics: filteredAnalytics,
                        legendSets,
                        customization: visualizationCustomizations[visualizationId],
                        countries: countriesAndSubregions.filter(country => countryIds.includes(country.id)),
                        regions: regions.filter(region => regionIds.includes(region.id)),
                        chartOptions: visualizationChartOptions ? visualizationChartOptions(chartSource) : undefined,
                        isScatter: visualization?.isScatter,
                        xAxis: visualization?.xAxis,
                        yAxis: visualization?.yAxis,
                        lastAvailableYearInRegion:
                            isLatestCOVID19 || isLatestYearAvailable ? undefined : lastAvailableYearInRegion,
                        lastAvailableYearInChart: lastAvailableYearInChart,
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
        countryIds,
        regions,
        regionIds,
        years,
        countriesAndSubregions,
        currentCountryOrRegion,
        getVisualizationDialogInfo,
        visualizationName,
        filterByLatestAvailableYearInRegion,
        needToKnowLatestAvailableYearInChart,
        isRegionalPage,
        seriesColors,
    ]);

    const onDownloadExcel = useCallback(
        (chartDataLoaded: ChartDataLoaded) => {
            const seriesData = chartDataLoaded?.chartOptions?.series ?? chartDataLoaded?.customization?.series;
            const seriesIdAndName = (seriesData || []).map(({ id, name }) => ({ id, name }));
            const selectedRegions = regions.filter(region => regionIds.includes(region.id));
            const periods =
                filterByLatestAvailableYearInRegion && chartDataLoaded?.lastAvailableYearInRegion
                    ? [chartDataLoaded?.lastAvailableYearInRegion]
                    : years;

            compositionRoot.indicatorExplorer.downloadAnalytics
                .execute({
                    visualizationIds: visualizationId.split("_"),
                    periods: periods,
                    countryIds: countryIds || [],
                    selectedRegions: selectedRegions,
                    seriesIdAndName: seriesIdAndName,
                    isScatter: chartDataLoaded?.isScatter,
                    xAxis: chartDataLoaded?.xAxis,
                    yAxis: chartDataLoaded?.yAxis,
                })
                .runAsync();
        },
        [
            compositionRoot.indicatorExplorer.downloadAnalytics,
            countryIds,
            filterByLatestAvailableYearInRegion,
            regionIds,
            regions,
            visualizationId,
            years,
        ]
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
    countryIds: Id[],
    selectedRegions: Region[]
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
                countryIds || [],
                selectedRegions || []
            ),
        }).flatMap(({ visualization, analytics }) => {
            const legendSetIds = getLegendSetIds(visualization, analytics);
            return Future.joinObj({
                visualization: Future.success(visualization),
                analytics: Future.success(analytics),
                legendSets:
                    legendSetIds.length > 0
                        ? compositionRoot.indicatorExplorer.getLegendSets.execute(legendSetIds)
                        : Future.success([]),
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

function getLastAvailableYearInRegion(
    analyticsResponse: Analytics[],
    isMultipleVisualizations: boolean,
    regionId: Id
): string | undefined {
    const rows = isMultipleVisualizations
        ? analyticsResponse.flatMap(analytics => analytics.rows)
        : analyticsResponse[0]?.rows || [];

    const lastAvailableYearInRegion = rows.reduce((lastAvailableYear, row): string => {
        const region = row[1]?.toString() || "";
        const year = row[2] || "";

        return regionId === region && year > lastAvailableYear ? year : lastAvailableYear;
    }, "0");

    return lastAvailableYearInRegion !== "0" ? lastAvailableYearInRegion : undefined;
}

function getLastAvailableYearInChartData(
    analyticsResponse: Analytics[],
    isMultipleVisualizations: boolean
): string | undefined {
    const rows = isMultipleVisualizations
        ? analyticsResponse.flatMap(analytics => analytics.rows)
        : analyticsResponse[0]?.rows || [];

    const lastAvailableYear = rows.reduce((lastAvailableYear, row): string => {
        const year = row[2] || "";

        return year > lastAvailableYear ? year : lastAvailableYear;
    }, "0");

    return lastAvailableYear !== "0" ? lastAvailableYear : undefined;
}
