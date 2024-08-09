import { SeriesColumnOptions } from "highcharts";
import { baseLegend } from "../legends/baseLegend";
import { typeOfCareSeries2 } from "../series/typeOfCareSeries";
import { ChartCustomization } from "../types";
import { chartSplitYearsAndCategories } from "../xAxis/chartSplitYearsAndCategories";
import { getSortedCategoriesOrderBySerieIdInLastYear } from "./utils/getSortedCategoriesOrderBySerieIdInLastYear";
import { sortSerieDataByYearsAndCategories } from "./utils/sortSerieDataByYearsAndCategories";
import _ from "lodash";

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
                rotation: -45,
                step: 1,
            },
        },
        {
            lineWidth: 0,
        },
    ],
    sortSerieData: (series, categories) => {
        if (!series) return series;
        // console.log({ series, categories });
        const customCategoriesOrder = getSortedCategoriesOrderBySerieIdInLastYear(
            series,
            categories,
            "S0rJgTIK3Gv",
            Object.keys(CATEGORY_ID_BY_NAME).length
        );

        // Add empty string for each categories year
        const categoriesWithLinesOffset = _.chunk(categories, customCategoriesOrder.length).flatMap(category => {
            return [...category, ""];
        });

        const seriesWithCategoryInData = series.map(serie => {
            if (serie.custom?.isTwoCategoryFakeSerie) return serie;
            return {
                ...serie,
                data: (serie.data || []).map((item, index) => {
                    return {
                        y: Array.isArray(item) && item.length > 1 ? item[1] || 0 : 0,
                        name: categoriesWithLinesOffset[index],
                    };
                }),
            } as unknown as SeriesColumnOptions;
        });

        const ret = sortSerieDataByYearsAndCategories(seriesWithCategoryInData, [...customCategoriesOrder, ""]);
        // console.log(ret);
        return ret;
    },
    series: typeOfCareSeries2,
    ...chartSplitYearsAndCategories,
};
