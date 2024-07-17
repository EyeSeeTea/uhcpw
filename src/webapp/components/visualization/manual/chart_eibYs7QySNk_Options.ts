import { ChartSource } from "./chartOptions";
import { comparativeColumnChartOptions } from "./generic/comparativeColumnChartOptions";

const seriesNames: Record<string, string> = {
    GyiW7dS7BIl: "Households with catastrophic health spending",
};

const seriesColors: Record<string, string> = {
    GyiW7dS7BIl: "#185698",
};

export const chart_eibYs7QySNk_Options: (chartSource: ChartSource) => Highcharts.Options = chartSource => {
    console.log(chartSource);
    return {
        ...comparativeColumnChartOptions(chartSource, seriesNames, seriesColors),
        legend: {
            enabled: false,
        },
    };
};
