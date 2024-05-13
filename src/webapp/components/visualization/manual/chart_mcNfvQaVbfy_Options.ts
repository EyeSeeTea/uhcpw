import { ChartSource } from "./chartOptions";
import { comparativeStackedColumnChartOptions } from "./generic/comparativeStackedColumnChartOptions";

const seriesNames: Record<string, string> = {
    "SpTdfmqlzNj.JGYECk6mKHE": "Diagnostic tests",
    "SpTdfmqlzNj.xFBx8HXhRn6": "Outpatient care",
    "SpTdfmqlzNj.NYLedCi0SnS": "Inpatient care",
    "SpTdfmqlzNj.WZQNt5d1TGm": "Medical products",
    "SpTdfmqlzNj.bHGxnqq0s6M": "Dental care",
    "SpTdfmqlzNj.CgeNM5PZBLy": "Medicines",
};

const seriesColors: Record<string, string> = {
    "SpTdfmqlzNj.JGYECk6mKHE": "#7030a0",
    "SpTdfmqlzNj.xFBx8HXhRn6": "#ffc000",
    "SpTdfmqlzNj.NYLedCi0SnS": "#00b050",
    "SpTdfmqlzNj.WZQNt5d1TGm": "#ed7d31",
    "SpTdfmqlzNj.bHGxnqq0s6M": "#0070c0",
    "SpTdfmqlzNj.CgeNM5PZBLy": "#c00000",
};

export const chart_mcNfvQaVbfy_Options: (chartSource: ChartSource) => Highcharts.Options = chartSource => {
    return {
        ...comparativeStackedColumnChartOptions(chartSource, seriesNames, seriesColors, "SpTdfmqlzNj.CgeNM5PZBLy"),
        yAxis: {
            ...comparativeStackedColumnChartOptions(chartSource, seriesNames, seriesColors)?.yAxis,
            title: {
                text: "Catastrophic health spending (%)",
                style: { fontSize: "13px" },
            },
        },
    };
};
