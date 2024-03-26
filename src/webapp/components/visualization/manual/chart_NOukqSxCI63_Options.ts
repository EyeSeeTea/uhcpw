import { ChartSource } from "./chartOptions";
import { comparativeColumnChartOptions } from "./generic/comparativeColumnChartOptions";

const seriesNames: Record<string, string> = {
    kBOh0hUi5bW: "Households with catastrophic health spending",
};

const seriesColors: Record<string, string> = {
    kBOh0hUi5bW: "#185698",
};

export const chart_NOukqSxCI63_Options: (chartSource: ChartSource) => Highcharts.Options = chartSource => {
    return {
        ...comparativeColumnChartOptions(chartSource, seriesNames, seriesColors),
        legend: {
            enabled: false,
        },
    };
};
