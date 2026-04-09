import { REGION_CODES } from "../../../../domain/entities/region/Region";
import {
    ColorOverrides,
    overrideDataSeriesColorAndUpdateLegends,
} from "../customization/charts/utils/overrideDataSeriesColorAndUpdateLegends";
import { ChartSource } from "./chartOptions";
import { comparativeStackedColumnChartOptions } from "./generic/comparativeStackedColumnChartOptions";
import { getChartSourceFilteredByLastAvailableYear } from "./utils/getChartSourceFilteredByLastAvailableYear";

const seriesNames: Record<string, string> = {
    S8OMD0f9IZp: "Out-of-pocket payments",
    ygo5a7mdudU: "Voluntary health insurance",
};

const seriesColors: Record<string, string> = {
    S8OMD0f9IZp: "#8fa2d4",
    ygo5a7mdudU: "#2f5597",
};

const dataSeriesColors: ColorOverrides = {
    S8OMD0f9IZp: {
        [REGION_CODES.EUROPEAN_UNION]: "#FFD073",
    },
    ygo5a7mdudU: {
        [REGION_CODES.EUROPEAN_UNION]: "#FF8739",
    },
};

export const chart_y4qAv6eW4nb_Options: (chartSource: ChartSource) => Highcharts.Options = chartSource => {
    const chartSourceWithFilteredRowsByLAY = getChartSourceFilteredByLastAvailableYear(chartSource);

    const chartOptions = comparativeStackedColumnChartOptions({
        chartSource: chartSourceWithFilteredRowsByLAY,
        seriesNames,
        seriesColors,
        orderByValueInSerie: "ygo5a7mdudU",
        categoryIdsOrder: Object.keys(seriesNames),
        isDescOrder: true,
        hideYear: !chartSource.isLatestYearAvailable && !chartSource.isLatestCOVID19,
    });

    const { series } = overrideDataSeriesColorAndUpdateLegends(
        chartOptions.series as Highcharts.SeriesColumnOptions[],
        dataSeriesColors
    );

    return {
        ...chartOptions,
        chart: {
            ...chartOptions.chart,
        },
        series,
        yAxis: {
            title: {
                text: "Current spending on health (%)",
                style: { fontSize: "13px" },
            },
        },
    };
};
