import { ChartSource } from "./chartOptions";
import { comparativeColumnChartOptions } from "./generic/comparativeColumnChartOptions";
import { getChartSourceFilteredByLastAvailableYear } from "./utils/getChartSourceFilteredByLastAvailableYear";

const seriesNames: Record<string, string> = {
    KEArMA9jlw6: "Out-of-pocket payments as a share of household consumption",
};

const seriesColors: Record<string, string> = {
    KEArMA9jlw6: "#00b050",
};

export const chart_GNUHM5lQMTp_Options: (chartSource: ChartSource) => Highcharts.Options = chartSource => {
    const chartSourceWithFilteredRows = getChartSourceFilteredByLastAvailableYear(chartSource);

    return {
        ...comparativeColumnChartOptions({
            chartSource: chartSourceWithFilteredRows,
            seriesNames,
            seriesColors,
            hideYear: !chartSource.isLatestYearAvailable && !chartSource.isLatestCOVID19,
        }),
        legend: {
            enabled: false,
        },
        yAxis: {
            ...comparativeColumnChartOptions({
                chartSource: chartSourceWithFilteredRows,
                seriesNames,
                seriesColors,
                hideYear: !chartSource.isLatestYearAvailable && !chartSource.isLatestCOVID19,
            })?.yAxis,
            title: {
                text: "Household budget (%)",
                style: { fontSize: "13px" },
            },
        },
    };
};
