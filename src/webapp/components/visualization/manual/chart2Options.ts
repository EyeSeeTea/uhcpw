import { ChartSource } from "./chartOptions";
import { comparativeStackedColumnChartOptions } from "./generic/comparativeStackedColumnChartOptions";

const seriesNames: Record<string, string> = {
    yKxOTGWUr4D: "Impoverished",
    MDhStd9lvOc: "Further impoverished",
};

const seriesColors: Record<string, string> = {
    yKxOTGWUr4D: "#e46c09",
    MDhStd9lvOc: "#c00000",
};

export const chart2Options: (chartSource: ChartSource) => Highcharts.Options = chartSource => {
    return comparativeStackedColumnChartOptions(chartSource, seriesNames, seriesColors);
};
