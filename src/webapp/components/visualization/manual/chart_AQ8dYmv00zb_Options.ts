import { REGION_CODES } from "../../../../domain/entities/region/Region";
import {
    ColorOverrides,
    overrideDataSeriesColorAndUpdateLegends,
} from "../customization/charts/utils/overrideDataSeriesColorAndUpdateLegends";
import { ChartSource } from "./chartOptions";
import { comparativeStackedColumnChartOptions } from "./generic/comparativeStackedColumnChartOptions";
import { getChartSourceFilteredByLastAvailableYear } from "./utils/getChartSourceFilteredByLastAvailableYear";

const seriesNames: Record<string, string> = {
    VlymT6gXw7P: "Home-based",
    wdLDa12XmHL: "Inpatient",
};

const seriesColors: Record<string, string> = {
    VlymT6gXw7P: "#8fa2d4",
    wdLDa12XmHL: "#2f5597",
};

const dataSeriesColors: ColorOverrides = {
    VlymT6gXw7P: {
        [REGION_CODES.EUROPEAN_UNION]: "#FFD073",
    },
    wdLDa12XmHL: {
        [REGION_CODES.EUROPEAN_UNION]: "#FF8739",
    },
};

export const chart_AQ8dYmv00zb_Options: (chartSource: ChartSource) => Highcharts.Options = chartSource => {
    const chartSourceWithFilteredRowsByLAY = getChartSourceFilteredByLastAvailableYear(chartSource);

    const chartOptions = comparativeStackedColumnChartOptions({
        chartSource: chartSourceWithFilteredRowsByLAY,
        seriesNames,
        seriesColors,
        categoryIdsOrder: Object.keys(seriesNames),
        isDescOrder: true,
        hideYear: !chartSource.isLatestYearAvailable && !chartSource.isLatestCOVID19,
    });

    const { series } = overrideDataSeriesColorAndUpdateLegends(
        chartOptions.series as Highcharts.SeriesColumnOptions[],
        dataSeriesColors
    );

    const [yAxisTitle = "Current €PPP per person"] = chartSource.visualization.axes
        .filter(axis => axis.type === "RANGE")
        .map(axis => axis.title.text);

    return {
        ...chartOptions,
        series,
        yAxis: {
            title: {
                text: yAxisTitle,
                style: { fontSize: "13px" },
            },
        },
    };
};
