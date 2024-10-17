import { SeriesColumnOptions } from "highcharts";
import { sortSerieDataByValueInSerie } from "../customization/charts/utils/sortSerieDataByValueInSerie";
import { ChartSource } from "./chartOptions";
import { comparativeStackedColumnChartOptions } from "./generic/comparativeStackedColumnChartOptions";
import { getChartSourceFilteredByLastAvailableYear } from "./utils/getChartSourceFilteredByLastAvailableYear";

const seriesNames: Record<string, string> = {
    WsUM8TQ7cEh: "Impoverished",
    yYSS1uBgnTE: "Further impoverished",
};

const seriesColors: Record<string, string> = {
    WsUM8TQ7cEh: "#e46c09",
    yYSS1uBgnTE: "#c00000",
};

export const chart_dbc87Ljw8uN_Options: (chartSource: ChartSource) => Highcharts.Options = chartSource => {
    const chartSourceWithFilteredRowsByLAY = getChartSourceFilteredByLastAvailableYear(chartSource);

    const chartOptions = comparativeStackedColumnChartOptions({
        chartSource: chartSourceWithFilteredRowsByLAY,
        seriesNames,
        seriesColors,
    });
    return {
        ...chartOptions,
        series: sortSerieDataByValueInSerie(chartOptions.series as SeriesColumnOptions[], "MDhStd9lvOc"),
    };
};
