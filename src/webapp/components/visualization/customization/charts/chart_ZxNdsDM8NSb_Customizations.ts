import { SeriesColumnOptions } from "highcharts";
import { baseLegend } from "../legends/baseLegend";
import { typeOfCareSeries2 } from "../series/typeOfCareSeries";
import { ChartCustomization } from "../types";
import { chartSplitYearsAndCategories } from "../xAxis/chartSplitYearsAndCategories";
import { getMaxYAxisAndYTickIntervalForStackedColumnsInChartSplitYearsAndCategories } from "../yAxis/getMaxYAxisAndYTickInterval";
import { sortSerieDataByYearsAndCategories } from "./utils/sortSerieDataByYearsAndCategories";
import { setYAxisMaxAxisAndTickIntervalWhenLegendItemClickInChartSplitYearsAndCategories } from "../../utils/getMaxAxisAndTickInterval";

const CATEGORY_ID_BY_NAME = {
    Poorest: "GeiKSyJLeKt",
    "2nd": "GuypYXqveWn",
    "3nd": "ii0MC8x9D7i",
    "4th": "O0MXmTdpf4m",
    Richest: "yiucIy5NIAw",
};

export const chart_ZxNdsDM8NSb_Customizations: ChartCustomization = {
    title: { text: "" },
    legend: { ...baseLegend, reversed: true },
    xAxis: [
        {
            lineWidth: 0,
            labels: {
                style: {
                    fontSize: "12px",
                },
                step: 1,
            },
        },
        {
            lineWidth: 0,
        },
    ],
    sortSerieData: (series, categories) => {
        if (!series) return series;

        return sortSerieDataByYearsAndCategories(series, categories, "", Object.keys(CATEGORY_ID_BY_NAME).length);
    },
    series: typeOfCareSeries2,
    getMaxYAxisAndYTickInterval: (series: SeriesColumnOptions[] | undefined) => {
        return getMaxYAxisAndYTickIntervalForStackedColumnsInChartSplitYearsAndCategories(series, {
            maxValueUpTo100: true,
        });
    },
    plotOptions: {
        series: {
            events: {
                legendItemClick: function (this: Highcharts.Series) {
                    return setYAxisMaxAxisAndTickIntervalWhenLegendItemClickInChartSplitYearsAndCategories(this, {
                        maxValueUpTo100: true,
                    });
                },
            },
        },
    },
    ...chartSplitYearsAndCategories,
};
