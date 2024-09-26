import { baseLegend } from "../legends/baseLegend";
import { typeOfCareSeries1 } from "../series/typeOfCareSeries";
import { ChartCustomization } from "../types";
import { chartSplitYearsAndCategories } from "../xAxis/chartSplitYearsAndCategories";
import { sortSerieDataByYearsAndCategories } from "./utils/sortSerieDataByYearsAndCategories";

const CATEGORY_ID_BY_NAME = {
    Poorest: "GeiKSyJLeKt",
    "2nd": "GuypYXqveWn",
    "3nd": "ii0MC8x9D7i",
    "4th": "O0MXmTdpf4m",
    Richest: "yiucIy5NIAw",
};

export const chart_fY7K8ATEDgQ_Customizations: ChartCustomization = {
    title: { text: "" },
    legend: { ...baseLegend, reversed: true },
    series: typeOfCareSeries1,
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
    ...chartSplitYearsAndCategories,
};
