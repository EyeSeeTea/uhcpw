import { ChartSource } from "./chartOptions";
import { comparativeGroupedColumnChartOptions } from "./generic/comparativeGroupedColumnChartOptions";
import { REGION_CODES } from "../../../../domain/entities/region/Region";
import Highcharts, { SeriesColumnOptions } from "highcharts";
import { overrideDataSeriesColorAndUpdateLegends } from "../customization/charts/utils/overrideDataSeriesColorAndUpdateLegends";
import { topLegend } from "../customization/legends/topLegend";

const seriesNames: Record<string, string> = {
    "2014": "2014",
    "2019": "2019",
};

const seriesColors: Record<string, string> = {
    "2014": "#8fa2d4",
    "2019": "#2f5597",
};

const dataSeriesColors: Record<string, Record<string, string>> = {
    "2014": {
        [REGION_CODES.EUROPEAN_UNION]: "#FFD073",
    },
    "2019": {
        [REGION_CODES.EUROPEAN_UNION]: "#FF8739",
    },
};

export const chart_eibYs7QySNk_Options: (chartSource: ChartSource) => Highcharts.Options = chartSource => {
    const filteredYears = chartSource.analyticsResponse.metaData.dimensions.pe || [];
    const isOnlyOneYearSelected = filteredYears.length === 1;

    const chartOptions = comparativeGroupedColumnChartOptions({
        chartSource: chartSource,
        seriesNames: seriesNames,
        seriesColors: seriesColors,
        defaultColor: seriesColors["2019"],
        isOnlyOneYearSelected: isOnlyOneYearSelected,
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
