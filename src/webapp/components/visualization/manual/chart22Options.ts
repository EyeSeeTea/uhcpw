import { ChartSource } from "./chartOptions";
import { baseChartOptions } from "./generic/baseChartOptions";

export const chart22Options: (chartSource: ChartSource) => Highcharts.Options = _chartSource => {
    return {
        ...baseChartOptions,
        yAxis: {
            title: {
                text: "GDP (%)",
            },
        },
    };
};
