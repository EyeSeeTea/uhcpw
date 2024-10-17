import { ChartSource } from "./chartOptions";
import { comparativeStackedColumnChartOptions } from "./generic/comparativeStackedColumnChartOptions";
import { getChartSourceFilteredByLastAvailableYear } from "./utils/getChartSourceFilteredByLastAvailableYear";

const seriesNames: Record<string, string> = {
    "eIs7xB9CAmV.JGYECk6mKHE": "Diagnostic tests",
    "eIs7xB9CAmV.xFBx8HXhRn6": "Outpatient care",
    "eIs7xB9CAmV.NYLedCi0SnS": "Inpatient care",
    "eIs7xB9CAmV.WZQNt5d1TGm": "Medical products",
    "eIs7xB9CAmV.bHGxnqq0s6M": "Dental care",
    "eIs7xB9CAmV.CgeNM5PZBLy": "Medicines",
};

const seriesColors: Record<string, string> = {
    "eIs7xB9CAmV.JGYECk6mKHE": "#7030a0",
    "eIs7xB9CAmV.xFBx8HXhRn6": "#ffc000",
    "eIs7xB9CAmV.NYLedCi0SnS": "#00b050",
    "eIs7xB9CAmV.WZQNt5d1TGm": "#ed7d31",
    "eIs7xB9CAmV.bHGxnqq0s6M": "#0070c0",
    "eIs7xB9CAmV.CgeNM5PZBLy": "#c00000",
};

export const chart_mcNfvQaVbfy_Options: (chartSource: ChartSource) => Highcharts.Options = chartSource => {
    const chartSourceWithFilteredRowsByLAY = getChartSourceFilteredByLastAvailableYear(chartSource);
    return {
        ...comparativeStackedColumnChartOptions({
            chartSource: chartSourceWithFilteredRowsByLAY,
            seriesNames,
            seriesColors,
            orderByValueInSerie: "eIs7xB9CAmV.CgeNM5PZBLy",
        }),
        yAxis: {
            ...comparativeStackedColumnChartOptions({
                chartSource: chartSourceWithFilteredRowsByLAY,
                seriesNames,
                seriesColors,
            })?.yAxis,
            title: {
                text: "Catastrophic health spending (%)",
                style: { fontSize: "13px" },
            },
        },
    };
};
