import { ChartSource } from "./chartOptions";
import { comparativeStackedColumnChartOptions } from "./generic/comparativeStackedColumnChartOptions";
import { getChartSourceFilteredByLastAvailableYear } from "./utils/getChartSourceFilteredByLastAvailableYear";

const seriesNames: Record<string, string> = {
    qy4W8ZY2g5M: "Diagnostic tests",
    ykAPKvVQusS: "Outpatient care",
    OEK4dKvUsOe: "Inpatient care",
    OuiKmOeXUWQ: "Medical products",
    a2u2ccahVJL: "Dental care",
    qgE5NJ9Nyaq: "Medicines",
};

const seriesColors: Record<string, string> = {
    qy4W8ZY2g5M: "#7030a0",
    ykAPKvVQusS: "#ffc000",
    OEK4dKvUsOe: "#00b050",
    OuiKmOeXUWQ: "#ed7d31",
    a2u2ccahVJL: "#0070c0",
    qgE5NJ9Nyaq: "#c00000",
};

export const chart_VB7bdJ8ZXya_Options: (chartSource: ChartSource) => Highcharts.Options = chartSource => {
    const chartSourceWithFilteredRowsByLAY = getChartSourceFilteredByLastAvailableYear(chartSource);
    const stackedValuesUpTo100 = chartSource.visualization.percentStackedValues;

    const chart = comparativeStackedColumnChartOptions({
        chartSource: chartSourceWithFilteredRowsByLAY,
        seriesNames,
        seriesColors,
        orderByValueInSerie: "qgE5NJ9Nyaq",
        stackedValuesUpTo100: stackedValuesUpTo100,
        maxValueUpTo100: true,
    });

    return {
        ...chart,
        yAxis: {
            ...chart?.yAxis,
            title: {
                text: "Catastrophic health spending (%)",
                style: { fontSize: "13px" },
            },
        },
    };
};
