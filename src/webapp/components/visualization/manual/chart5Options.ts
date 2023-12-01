import { ChartSource } from "./chartOptions";
import { comparativeStackedColumnChartOptions } from "./generic/comparativeStackedColumnChartOptions";

const seriesNames: Record<string, string> = {
    yiucIy5NIAw: "Richest",
    O0MXmTdpf4m: "4th",
    ii0MC8x9D7i: "3rd",
    GuypYXqveWn: "2nd",
    GeiKSyJLeKt: "Poorest",
};

const seriesColors: Record<string, string> = {
    yiucIy5NIAw: "#bac4e2",
    O0MXmTdpf4m: "#8fa2d4",
    ii0MC8x9D7i: "#4472c4",
    GuypYXqveWn: "#2f5597",
    GeiKSyJLeKt: "#203864",
};

export const chart5Options: (chartSource: ChartSource) => Highcharts.Options = chartSource => {
    return comparativeStackedColumnChartOptions(chartSource, seriesNames, seriesColors);
};
