import { ChartSource } from "./chartOptions";
import { comparativeGroupedColumnChartOptions } from "./generic/comparativeGroupedColumnChartOptions";

const seriesNames: Record<string, string> = {
    2014: "2014",
    2019: "2019",
};

const seriesColors: Record<string, string> = {
    2014: "#a7bf25",
    2019: "#0070c0",
};

export const chart_eibYs7QySNk_Options: (chartSource: ChartSource) => Highcharts.Options = chartSource => {
    return comparativeGroupedColumnChartOptions(chartSource, seriesNames, seriesColors);
};
