import { getColorOfRegionByRegionId } from "../../../pages/regional-page/getColorOfRegion";
import { ChartSource } from "./chartOptions";
import { comparativeColumnChartOptions } from "./generic/comparativeColumnChartOptions";
import { getChartSourceFilteredByLastAvailableYear } from "./utils/getChartSourceFilteredByLastAvailableYear";

const seriesNames: Record<string, string> = {
    yOmEYW4OgYj: "Public spending on health as a share of current spending on health",
};

const seriesColors: Record<string, string> = {
    yOmEYW4OgYj: "#00b050",
};

export const chart_bGXcyPKaMWD_Options: (chartSource: ChartSource) => Highcharts.Options = chartSource => {
    const currentRegion = chartSource.regions.find(
        region =>
            region.id === chartSource.currentCountryOrRegion ||
            region.linkedOrgUnitId === chartSource.currentCountryOrRegion
    );

    const chartSourceWithFilteredRows = getChartSourceFilteredByLastAvailableYear(chartSource);

    const chart = comparativeColumnChartOptions({
        chartSource: chartSourceWithFilteredRows,
        seriesNames,
        seriesColors,
        currentSerieColor: currentRegion ? getColorOfRegionByRegionId(currentRegion.id) : "#c00000",
        useRegionColors: true,
        hideYear: true,
    });

    return {
        ...chart,
        legend: {
            enabled: false,
        },
        yAxis: {
            ...chart?.yAxis,
            title: {
                text: chartSource.visualization.axes[0]?.title.text ?? "Current spending on health (%)",
                style: { fontSize: "13px" },
            },
        },
    };
};
