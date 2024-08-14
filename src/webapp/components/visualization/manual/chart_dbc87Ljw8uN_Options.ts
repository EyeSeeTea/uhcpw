import { SeriesColumnOptions } from "highcharts";
import { sortSerieDataByValueInSerie } from "../customization/charts/utils/sortSerieDataByValueInSerie";
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

export const chart_dbc87Ljw8uN_Options: (chartSource: ChartSource) => Highcharts.Options = chartSource => {
    const chartOptions = comparativeStackedColumnChartOptions({ chartSource, seriesNames, seriesColors });
    return {
        ...chartOptions,
        series: sortSerieDataByValueInSerie(chartOptions.series as SeriesColumnOptions[], "MDhStd9lvOc"),
    };
};
