import { ChartSource } from "./chartOptions";
import { comparativeColumnChartOptions } from "./generic/comparativeColumnChartOptions";
import { getChartSourceFilteredByLastAvailableYear } from "./utils/getChartSourceFilteredByLastAvailableYear";

const seriesNames: Record<string, string> = {
    ygo5a7mdudU: "Public spending on health as a share of government spending",
};

const seriesColors: Record<string, string> = {
    ygo5a7mdudU: "#ffc000",
};

export const chart_nD19UhusyuR_Options: (chartSource: ChartSource) => Highcharts.Options = chartSource => {
    const chartSourceWithFilteredRows = getChartSourceFilteredByLastAvailableYear(chartSource);

    return {
        ...comparativeColumnChartOptions({
            chartSource: chartSourceWithFilteredRows,
            seriesNames,
            seriesColors,
            useRegionColors: true,
        }),
        legend: {
            enabled: false,
        },
        yAxis: {
            ...comparativeColumnChartOptions({
                chartSource: chartSourceWithFilteredRows,
                seriesNames,
                seriesColors,
                useRegionColors: true,
            })?.yAxis,
            title: {
                text: "Current spending health (%)",
                style: { fontSize: "13px" },
            },
        },
    };
};
