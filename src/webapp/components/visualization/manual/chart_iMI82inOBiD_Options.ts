import { ChartSource } from "./chartOptions";
import { comparativeSingleYearColumnChartOptions } from "./generic/comparativeSingleYearColumnChartOptions";

const seriesNames: Record<string, string> = {
    aYK8f4GuHBP: "Public spending on health as a share of government spending",
};

const seriesColors: Record<string, string> = {
    aYK8f4GuHBP: "#00b050",
};

export const chart_iMI82inOBiD_Options: (chartSource: ChartSource) => Highcharts.Options = chartSource => {
    return {
        ...comparativeSingleYearColumnChartOptions({
            chartSource,
            seriesNames,
            seriesColors,
            currentYear: chartSource.currentYear,
            currentSerieColor: "#c00000",
        }),
        legend: {
            enabled: false,
        },
        yAxis: {
            ...comparativeSingleYearColumnChartOptions({
                chartSource,
                seriesNames,
                seriesColors,
                currentYear: chartSource.currentYear,
                currentSerieColor: "#c00000",
            })?.yAxis,
            title: {
                text: "Government spending (%)",
                style: { fontSize: "13px" },
            },
        },
    };
};
