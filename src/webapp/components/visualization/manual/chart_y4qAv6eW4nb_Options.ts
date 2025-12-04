import { ChartSource } from "./chartOptions";
import { comparativeStackedColumnChartOptions } from "./generic/comparativeStackedColumnChartOptions";
import { getChartSourceFilteredByLastAvailableYear } from "./utils/getChartSourceFilteredByLastAvailableYear";

const seriesNames: Record<string, string> = {
    S8OMD0f9IZp: "Out-of-pocket payments",
    ygo5a7mdudU: "Voluntary health insurance",
};

const seriesColors: Record<string, string> = {
    S8OMD0f9IZp: "#8fa2d4",
    ygo5a7mdudU: "#2f5597",
};

export const chart_y4qAv6eW4nb_Options: (chartSource: ChartSource) => Highcharts.Options = chartSource => {
    const chartSourceWithFilteredRowsByLAY = getChartSourceFilteredByLastAvailableYear(chartSource);

    const chartOptions = comparativeStackedColumnChartOptions({
        chartSource: chartSourceWithFilteredRowsByLAY,
        seriesNames,
        seriesColors,
        orderByValueInSerie: "ygo5a7mdudU",
        categoryIdsOrder: Object.keys(seriesNames),
        isDescOrder: true,
    });
    return {
        ...chartOptions,
        series: chartOptions.series,
        yAxis: {
            title: {
                text: "Current spending on health (%)",
                style: { fontSize: "13px" },
            },
        },
    };
};
