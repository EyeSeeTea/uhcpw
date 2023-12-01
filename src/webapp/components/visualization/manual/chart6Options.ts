import { ChartSource } from "./chartOptions";
import { comparativeStackedColumnChartOptions } from "./generic/comparativeStackedColumnChartOptions";

const seriesNames: Record<string, string> = {
    ykAPKvVQusS: "Outpatient care",
    qy4W8ZY2g5M: "Diagnostic tests",
    OEK4dKvUsOe: "Inpatient care",
    a2u2ccahVJL: "Dental care",
    OuiKmOeXUWQ: "Medical products",
    qgE5NJ9Nyaq: "Medicines",
};

const seriesColors: Record<string, string> = {
    ykAPKvVQusS: "#ffc001",
    qy4W8ZY2g5M: "#702fa0",
    OEK4dKvUsOe: "#00b050",
    a2u2ccahVJL: "#0071c0",
    OuiKmOeXUWQ: "#ed7d31",
    qgE5NJ9Nyaq: "#c00000",
};

export const chart6Options: (chartSource: ChartSource) => Highcharts.Options = chartSource => {
    return comparativeStackedColumnChartOptions(chartSource, seriesNames, seriesColors);
};
