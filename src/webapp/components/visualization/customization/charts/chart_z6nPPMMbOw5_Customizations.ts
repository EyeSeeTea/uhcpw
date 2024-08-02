import { SeriesColumnOptions } from "highcharts";
import { baseLegend } from "../legends/baseLegend";
import { ChartCustomization } from "../types";
import { sortSerieDataByYearsAndCategories } from "./utils/sortSerieDataByYearsAndCategories";
import { chartSplitYearsAndCategories } from "../xAxis/chartSplitYearsAndCategories";
import _ from "lodash";

export const chart_z6nPPMMbOw5_Customizations: ChartCustomization = {
    title: { text: "" },
    legend: { ...baseLegend, reversed: true },
    series: [
        {
            id: "S0rJgTIK3Gv",
            name: "Out-of-pocket payments",
            color: "#c00000",
            dataLabels: {
                enabled: false,
            },
        },
        {
            id: "u8ZcWehUz9H",
            name: "Voluntary health insurance",
            color: "#ffc112",
            dataLabels: {
                enabled: false,
            },
        },
        {
            id: "OE8u72wcKty",
            name: "Public spending on health",
            color: "#00b050",
            dataLabels: {
                enabled: false,
            },
        },
    ],
    xAxis: [
        {
            lineWidth: 0,
            title: { text: "" },
        },
        {
            lineWidth: 0,
        },
    ],
    sortSerieData: (series, categories) => {
        if (!series) return series;

        // TODO get name by id
        const customCategoriesOrder = [
            { id: "a2u2ccahVJL", name: "Dental care" },
            { id: "OuiKmOeXUWQ", name: "Medical products" },
            { id: "ykAPKvVQusS", name: "Outpatient care" },
            { id: "qgE5NJ9Nyaq", name: "Medicines" },
            { id: "OEK4dKvUsOe", name: "Inpatient care" },
            { id: "qy4W8ZY2g5M", name: "Diagnostic tests" },
            { id: "", name: "" },
        ];

        // Add empty string for each categories year
        const categoriesWithLinesOffset = _.chunk(categories, customCategoriesOrder.length - 1).flatMap(category => {
            return [...category, ""];
        });

        const seriesWithCategoryInData = series.map(serie => {
            if (serie.custom?.isTwoCategoryFakeSerie) return serie;
            return {
                ...serie,
                data: (serie.data || []).map((item, index) => {
                    return {
                        y: (item as [string | number, number | null])[1] || 0,
                        name: categoriesWithLinesOffset[index],
                    };
                }),
            } as unknown as SeriesColumnOptions;
        });

        return sortSerieDataByYearsAndCategories(
            seriesWithCategoryInData,
            customCategoriesOrder.map(item => item.name)
        );
    },
    ...chartSplitYearsAndCategories,
};
