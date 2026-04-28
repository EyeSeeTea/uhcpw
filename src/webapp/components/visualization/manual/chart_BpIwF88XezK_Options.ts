import { ChartSource } from "./chartOptions";
import { comparativeSingleYearColumnChartOptions } from "./generic/comparativeSingleYearColumnChartOptions";

const seriesNames: Record<string, string> = {
    OE8u72wcKty: "Public spending on health",
    u8ZcWehUz9H: "Voluntary health insurance",
    S0rJgTIK3Gv: "Out-of-pocket payments",
};

const seriesColors: Record<string, string> = {
    OE8u72wcKty: "#00b050",
    u8ZcWehUz9H: "#ffc112",
    S0rJgTIK3Gv: "#c00000",
};

export const chart_BpIwF88XezK_Options: (chartSource: ChartSource) => Highcharts.Options = chartSource => {
    const chart = comparativeSingleYearColumnChartOptions({
        chartSource,
        seriesNames,
        seriesColors,
        currentYear: chartSource.currentYear,
        orderByValueInSerie: "S0rJgTIK3Gv",
        stackedValuesUpTo100: true,
        hideYear: true,
    });

    return {
        ...chart,
        yAxis: {
            ...chart?.yAxis,
            title: {
                text: "Current spending health (%)",
                style: { fontSize: "13px" },
            },
        },
    };
};
