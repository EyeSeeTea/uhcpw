import { ChartSource } from "./chartOptions";
import { comparativeStackedColumnChartOptions } from "./generic/comparativeStackedColumnChartOptions";

const seriesNames: Record<string, string> = {
    "SpTdfmqlzNj.xFBx8HXhRn6": "Outpatient care",
    "SpTdfmqlzNj.JGYECk6mKHE": "Diagnostic tests",
    "SpTdfmqlzNj.NYLedCi0SnS": "Inpatient care",
    "SpTdfmqlzNj.bHGxnqq0s6M": "Dental care",
    "SpTdfmqlzNj.WZQNt5d1TGm": "Medical products",
    "SpTdfmqlzNj.CgeNM5PZBLy": "Medicines",
};

const seriesColors: Record<string, string> = {
    "SpTdfmqlzNj.xFBx8HXhRn6": "#ffc001",
    "SpTdfmqlzNj.JGYECk6mKHE": "#702fa0",
    "SpTdfmqlzNj.NYLedCi0SnS": "#00b050",
    "SpTdfmqlzNj.bHGxnqq0s6M": "#0071c0",
    "SpTdfmqlzNj.WZQNt5d1TGm": "#ed7d31",
    "SpTdfmqlzNj.CgeNM5PZBLy": "#c00000",
};

export const chart7Options: (chartSource: ChartSource) => Highcharts.Options = chartSource => {
    return comparativeStackedColumnChartOptions(chartSource, seriesNames, seriesColors);
};
