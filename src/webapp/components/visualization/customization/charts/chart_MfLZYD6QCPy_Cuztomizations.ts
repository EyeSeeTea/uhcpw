import { SeriesColumnOptions } from "highcharts";
import { createCountrySerie } from "../builders/buildCountrySerie";
import { baseLegend } from "../legends/baseLegend";
import { ChartCustomization } from "../types";
import { getMaxYAxisAndYTickIntervalForGroupedColumns } from "../yAxis/getMaxYAxisAndYTickInterval";
import {
    getMaxAxisAndTickInterval,
    getMaxValuesInSeriesData,
    isNumberData,
} from "../../utils/getMaxAxisAndTickInterval";
import { SeriesWithData } from "../../manual/utils/getMaxYAxisAndYTickInterval";

const MAP_CATEGORY_NAME: Record<string, string> = {
    "UHCW_Self-reported unmet need for prescribed medicines due to cost (average)": "Average",
    "UHCW_Self-reported unmet need for prescribed medicines due to cost (poorest)": "Poorest quintile",
    "UHCW_Self-reported unmet need for prescribed medicines due to cost (richest)": "Richest quintile",
};

export const chart_MfLZYD6QCPy_Cuztomizations: ChartCustomization = {
    title: { text: "" },
    legend: { ...baseLegend },
    countryOrRegionSerie: createCountrySerie,
    renameCategoriesXAxis: categories => categories.map(category => MAP_CATEGORY_NAME[category] || category),
    yAxis: {
        title: {
            text: "People needing care (%)",
            style: { fontSize: "13px" },
        },
    },
    xAxis: [
        {
            gridLineWidth: 0,
        },
        {
            gridLineWidth: 0,
            lineWidth: 0,
        },
    ],
    plotOptions: {
        series: {
            grouping: true,
            events: {
                legendItemClick: function (this: Highcharts.Series) {
                    const isSelectedSerieHide = this.visible;
                    const selectedSerieIndex = this.index;
                    const seriesInChart = this.chart.series as SeriesWithData[];

                    const visibleSeries = seriesInChart.filter((serie, index) => {
                        const isSelectedSerie = index === selectedSerieIndex;
                        const isSelectedSerieVisible = !isSelectedSerieHide && isSelectedSerie;
                        const isNotSelectedSeriesVisible = !isSelectedSerie && serie.visible;
                        return isSelectedSerieVisible || isNotSelectedSeriesVisible;
                    });

                    const seriesNumberData = visibleSeries.map(serie =>
                        serie.data.map(data => (isNumberData(data?.y) ? data?.y : 0))
                    );

                    const allDataIsZero = seriesNumberData.every(serieData => serieData.every(data => data === 0));

                    if (seriesNumberData && !allDataIsZero) {
                        const maxValuesInSeriesData = getMaxValuesInSeriesData(seriesNumberData);
                        const { max: adjustedMaxYAxis, tickInterval: yTickInterval } =
                            getMaxAxisAndTickInterval(maxValuesInSeriesData);

                        this.chart.yAxis.forEach(yAxis => {
                            yAxis.update({
                                max: adjustedMaxYAxis,
                                tickInterval: yTickInterval,
                            });
                        });
                    } else if (allDataIsZero) {
                        this.chart.yAxis.forEach(yAxis => {
                            yAxis.update({
                                max: 0,
                                tickInterval: 0,
                            });
                        });
                    }

                    return true;
                },
            },
        },
    },
    getMaxYAxisAndYTickInterval: (series: SeriesColumnOptions[] | undefined) => {
        return getMaxYAxisAndYTickIntervalForGroupedColumns(series);
    },
};
