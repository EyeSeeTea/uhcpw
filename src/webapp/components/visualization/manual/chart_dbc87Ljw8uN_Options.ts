import { ChartSource } from "./chartOptions";
import { comparativeStackedColumnChartOptions } from "./generic/comparativeStackedColumnChartOptions";
import { getChartSourceFilteredByLastAvailableYear } from "./utils/getChartSourceFilteredByLastAvailableYear";

const seriesNames: Record<string, string> = {
    CMKOYzqDIZD: "Impoverished",
    OQ4P2FX0ApA: "Further impoverished",
};

const seriesColors: Record<string, string> = {
    CMKOYzqDIZD: "#e46c09",
    OQ4P2FX0ApA: "#c00000",
};

export const chart_dbc87Ljw8uN_Options: (chartSource: ChartSource) => Highcharts.Options = chartSource => {
    const chartSourceWithFilteredRowsByLAY = getChartSourceFilteredByLastAvailableYear(chartSource);

    const chartOptions = comparativeStackedColumnChartOptions({
        chartSource: chartSourceWithFilteredRowsByLAY,
        seriesNames,
        seriesColors,
        hideYear: !chartSource.isLatestYearAvailable && !chartSource.isLatestCOVID19,
    });
    return {
        ...chartOptions,
        series: chartOptions.series,
    };
};
