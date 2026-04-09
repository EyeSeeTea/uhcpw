import { topLegend } from "../customization/legends/topLegend";
import { ChartSource } from "./chartOptions";
import { comparativeGroupedColumnChartOptions } from "./generic/comparativeGroupedColumnChartOptions";

const seriesNames: Record<string, string> = {
    q264eA2maJQ: "Personal care",
    fWXNjoVI44u: "Household activities",
};

const seriesColors: Record<string, string> = {
    q264eA2maJQ: "#8fa2d4",
    fWXNjoVI44u: "#2f5597",
};

export const chart_wFITZgQ3udq_Options: (chartSource: ChartSource) => Highcharts.Options = chartSource => {
    const chartOptions = comparativeGroupedColumnChartOptions({
        chartSource: chartSource,
        seriesNames: seriesNames,
        seriesColors: seriesColors,
        orderByValueInSerie: "q264eA2maJQ",
    });

    return {
        ...chartOptions,
        legend: topLegend,
    };
};
