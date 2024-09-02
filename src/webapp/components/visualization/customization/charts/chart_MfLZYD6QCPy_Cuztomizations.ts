import { createCountrySerie } from "../builders/buildCountrySerie";
import { baseLegend } from "../legends/baseLegend";
import { ChartCustomization } from "../types";

const MAP_CATEGORY_NAME: Record<string, string> = {
    "UHCW_Self-reported unmet need for prescribed medicines due to cost (average)": "Average",
    "UHCW_Self-reported unmet need for prescribed medicines due to cost (poorest)": "Poorest quintile",
    "UHCW_Self-reported unmet need for prescribed medicines due to cost (richest)": "Richest quintile",
};

export const chart_MfLZYD6QCPy_Cuztomizations: ChartCustomization = {
    title: { text: "" },
    legend: { ...baseLegend },
    countrySerie: createCountrySerie,
    renameCategoriesXAxis: categories => categories.map(category => MAP_CATEGORY_NAME[category] || category),
    yAxis: {
        title: {
            text: "People needing care (%)",
            style: { fontSize: "13px" },
        },
    },
    plotOptions: {
        series: {
            grouping: true,
        },
    },
};
