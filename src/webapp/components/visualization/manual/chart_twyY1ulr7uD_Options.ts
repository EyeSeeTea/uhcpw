import { getColorOfRegionByRegionId } from "../../../pages/regional-page/getColorOfRegion";
import { ChartSource } from "./chartOptions";
import { comparativeColumnChartOptions } from "./generic/comparativeColumnChartOptions";
import { getChartSourceFilteredByLastAvailableYear } from "./utils/getChartSourceFilteredByLastAvailableYear";
import { getChartSourceFilteredByYear } from "./utils/getChartSourceFilteredByYear";

const seriesNames: Record<string, string> = {
    S8OMD0f9IZp: "Out-of-pocket payments as a share of current spending on health",
};

const seriesColors: Record<string, string> = {
    S8OMD0f9IZp: "#00b050",
};

export const chart_twyY1ulr7uD_Options: (chartSource: ChartSource) => Highcharts.Options = chartSource => {
    const currentRegion = chartSource.regions.find(
        region =>
            region.id === chartSource.currentCountryOrRegion ||
            region.linkedOrgUnitId === chartSource.currentCountryOrRegion
    );

    const chartSourceWithFilteredRows = chartSource.yearToFilterBy
        ? getChartSourceFilteredByYear(chartSource)
        : getChartSourceFilteredByLastAvailableYear(chartSource);

    const chart = comparativeColumnChartOptions({
        orderByValueInSerie: "S8OMD0f9IZp",
        chartSource: chartSourceWithFilteredRows,
        seriesNames,
        seriesColors,
        currentSerieColor: currentRegion ? getColorOfRegionByRegionId(currentRegion.id) : "#c00000",
        useRegionColors: true,
    });

    return {
        ...chart,
        legend: {
            enabled: false,
        },
        yAxis: {
            ...chart.yAxis,
            title: {
                text: chartSource.visualization.axes[0]?.title.text || "",
                style: { fontSize: "13px" },
            },
        },
    };
};
