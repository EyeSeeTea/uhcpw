import { getColorOfRegionByRegionId } from "../../../pages/regional-page/getColorOfRegion";
import { ChartSource } from "./chartOptions";
import { comparativeColumnChartOptions } from "./generic/comparativeColumnChartOptions";
import { getChartSourceFilteredByLastAvailableYear } from "./utils/getChartSourceFilteredByLastAvailableYear";
import { getChartSourceFilteredByYear } from "./utils/getChartSourceFilteredByYear";

const seriesNames: Record<string, string> = {
    aYK8f4GuHBP: "Public spending on health as a share of government spending",
};

const seriesColors: Record<string, string> = {
    aYK8f4GuHBP: "#00b050",
};

export const chart_B4CnzUqVR3n_Options: (chartSource: ChartSource) => Highcharts.Options = chartSource => {
    const currentRegion = chartSource.regions.find(
        region =>
            region.id === chartSource.currentCountryOrRegion ||
            region.linkedOrgUnitId === chartSource.currentCountryOrRegion
    );

    const chartSourceWithFilteredRows = chartSource.yearToFilterBy
        ? getChartSourceFilteredByYear(chartSource)
        : getChartSourceFilteredByLastAvailableYear(chartSource);

    return {
        ...comparativeColumnChartOptions({
            chartSource: chartSourceWithFilteredRows,
            seriesNames,
            seriesColors,
            currentSerieColor: currentRegion ? getColorOfRegionByRegionId(currentRegion.id) : "#c00000",
        }),
        legend: {
            enabled: false,
        },
        yAxis: {
            ...comparativeColumnChartOptions({
                chartSource: chartSourceWithFilteredRows,
                seriesNames,
                seriesColors,
                currentSerieColor: currentRegion ? getColorOfRegionByRegionId(currentRegion.id) : "#c00000",
            })?.yAxis,
            title: {
                text: "Government spending (%)",
                style: { fontSize: "13px" },
            },
        },
    };
};
