import { ChartSource } from "./chartOptions";
import { comparativeColumnChartOptions } from "./generic/comparativeColumnChartOptions";

const seriesNames: Record<string, string> = {
    Ce6oTgNCapd: "Public spending on health as a share of government spending",
};

const seriesColors: Record<string, string> = {
    Ce6oTgNCapd: "#00b050",
};

export const chart4Options: (chartSource: ChartSource) => Highcharts.Options = chartSource => {
    return {
        ...comparativeColumnChartOptions(chartSource, seriesNames, seriesColors, "#c00000"),
        legend: {
            enabled: false,
        },
        yAxis: {
            title: {
                text: "Government spending (%)",
            },
        },
    };
};
