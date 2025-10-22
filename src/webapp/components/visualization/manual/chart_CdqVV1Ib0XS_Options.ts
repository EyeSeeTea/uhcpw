import { ChartSource } from "./chartOptions";
import { comparativeStackedColumnChartOptions } from "./generic/comparativeStackedColumnChartOptions";

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
    const stackedValuesUpTo100 = chartSource.visualization.percentStackedValues;

    const chart = comparativeStackedColumnChartOptions({
        chartSource: chartSource,
        seriesNames,
        seriesColors,
        orderByValueInSerie: "S8OMD0f9IZp",
        stackedValuesUpTo100: stackedValuesUpTo100,
        maxValueUpTo100: true,
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
