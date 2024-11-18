import { SeriesColumnOptions } from "highcharts";
import { baseLegend } from "../legends/baseLegend";
import { ChartCustomization } from "../types";
import { sortSerieDataByValueInSerie } from "./utils/sortSerieDataByValueInSerie";
import { getMaxYAxisAndYTickIntervalForStackedColumnsWithYData } from "../yAxis/getMaxYAxisAndYTickInterval";
import { setYAxisMaxAxisAndTickIntervalWhenLegendItemClick } from "../../utils/getMaxAxisAndTickInterval";

export const chart_TzWcDtEOTPX_Customizations: ChartCustomization = {
    title: { text: "" },
    legend: { ...baseLegend, reversed: true },
    series: [
        {
            id: "yYSS1uBgnTE",
            name: "Further impoverished",
            color: "#c00001",
            dataLabels: {
                enabled: false,
            },
        },
        {
            id: "WsUM8TQ7cEh",
            name: "Impoverished",
            color: "#e46c0b",
            dataLabels: {
                enabled: false,
            },
        },
        {
            id: "ySqmYZL9k7Q",
            name: "At risk of impoverishment",
            color: "#fec000",
            dataLabels: {
                enabled: false,
            },
        },
        {
            id: "imkocvILz0h",
            name: "Not at risk of impoverishment",
            color: "#91cf50",
            dataLabels: {
                enabled: false,
            },
        },
    ],
    xAxis: {
        title: { text: "" },
    },
    sortSerieData: (series, categories) => {
        if (!series) return series;

        const seriesWithCategoryInData = series.map(serie => {
            return {
                ...serie,
                data: (serie.data || []).map((item, index) => {
                    return {
                        y: item,
                        name: categories[index],
                    };
                }),
            } as unknown as SeriesColumnOptions;
        });

        return sortSerieDataByValueInSerie(seriesWithCategoryInData, "S0rJgTIK3Gv");
    },
    getMaxYAxisAndYTickInterval: (series: SeriesColumnOptions[] | undefined) => {
        return getMaxYAxisAndYTickIntervalForStackedColumnsWithYData(series, true);
    },
    plotOptions: {
        series: {
            events: {
                legendItemClick: function (this: Highcharts.Series) {
                    return setYAxisMaxAxisAndTickIntervalWhenLegendItemClick(this, {
                        isStacked: true,
                        stackedValuesUpTo100: true,
                    });
                },
            },
        },
    },
};
