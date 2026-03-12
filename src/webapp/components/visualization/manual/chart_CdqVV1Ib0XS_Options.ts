import { ChartSource } from "./chartOptions";
import { comparativeStackedColumnChartOptions } from "./generic/comparativeStackedColumnChartOptions";
import { getChartSourceFilteredByLastAvailableYear } from "./utils/getChartSourceFilteredByLastAvailableYear";

const seriesNames: Record<string, string> = {
    yOmEYW4OgYj: "Public spending on health",
    CwSSBtOK1VT: "Voluntary health insurance",
    S8OMD0f9IZp: "Out-of-pocket payments",
};

const seriesColors: Record<string, string> = {
    yOmEYW4OgYj: "#00b050",
    CwSSBtOK1VT: "#ffc112",
    S8OMD0f9IZp: "#c00000",
};

export const chart_CdqVV1Ib0XS_Options: (chartSource: ChartSource) => Highcharts.Options = chartSource => {
    const chartSourceWithFilteredRows = getChartSourceFilteredByLastAvailableYear(chartSource);

    const stackedValuesUpTo100 = chartSourceWithFilteredRows.visualization.percentStackedValues;

    const chart = comparativeStackedColumnChartOptions({
        chartSource: chartSourceWithFilteredRows,
        seriesNames,
        seriesColors,
        orderByValueInSerie: "S8OMD0f9IZp",
        stackedValuesUpTo100: stackedValuesUpTo100,
        maxValueUpTo100: true,
        hideYear: !chartSource.isLatestYearAvailable && !chartSource.isLatestCOVID19,
    });

    return {
        ...chart,
        yAxis: {
            ...chart?.yAxis,
            title: {
                text: "Current spending on health (%)",
                style: { fontSize: "13px" },
            },
        },
    };
};
