import { REGION_CODES } from "../../../../domain/entities/region/Region";
import { SeriesColumnOptions } from "highcharts";
import {
    ColorOverrides,
    overrideDataSeriesColorAndUpdateLegends,
} from "../customization/charts/utils/overrideDataSeriesColorAndUpdateLegends";
import { topLegend } from "../customization/legends/topLegend";
import { ChartSource } from "./chartOptions";
import { comparativeGroupedColumnChartOptions } from "./generic/comparativeGroupedColumnChartOptions";

const seriesNames: Record<string, string> = {
    q264eA2maJQ: "Personal care",
    fWXNjoVI44u: "Household activities",
};

const seriesColors: Record<string, string> = {
    q264eA2maJQ: "#8fa2d4",
    fWXNjoVI44u: "#2f5597",
};

const dataSeriesColors: ColorOverrides = {
    q264eA2maJQ: {
        [REGION_CODES.EUROPEAN_UNION]: "#FFD073",
    },
    fWXNjoVI44u: {
        [REGION_CODES.EUROPEAN_UNION]: "#FF8739",
    },
};

export const chart_wFITZgQ3udq_Options: (chartSource: ChartSource) => Highcharts.Options = chartSource => {
    const chartOptions = comparativeGroupedColumnChartOptions({
        chartSource: chartSource,
        seriesNames: seriesNames,
        seriesColors: seriesColors,
        orderByValueInSerie: "q264eA2maJQ",
    });

    const { series } = overrideDataSeriesColorAndUpdateLegends(
        chartOptions.series as SeriesColumnOptions[],
        dataSeriesColors
    );

    return {
        ...chartOptions,
        legend: topLegend,
        series,
    };
};
