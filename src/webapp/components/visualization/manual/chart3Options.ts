import { ChartSource } from "./chartOptions";
import { comparativeColumnChartOptions } from "./generic/comparativeColumnChartOptions";

const seriesNames: Record<string, string> = {
    kBOh0hUi5bW: "Households with catastrophic health spending",
};

const seriesColors: Record<string, string> = {
    kBOh0hUi5bW: "#5780c9",
};

export const chart3Options: (chartSource: ChartSource) => Highcharts.Options = chartSource => {
    return {
        ...comparativeColumnChartOptions(chartSource, seriesNames, seriesColors),
        legend: {
            enabled: false,
        },
    };
};
