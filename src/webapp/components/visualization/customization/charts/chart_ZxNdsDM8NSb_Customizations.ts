import { baseLegend } from "../legends/baseLegend";
import { typeOfCareSeries2 } from "../series/typeOfCareSeries";
import { ChartCustomization } from "../types";
import { chartSplitYearsAndCategories } from "../xAxis/chartSplitYearsAndCategories";

export const chart_ZxNdsDM8NSb_Customizations: ChartCustomization = {
    title: { text: "" },
    legend: { ...baseLegend, reversed: true },
    xAxis: [
        {
            lineWidth: 0,
        },
        {
            lineWidth: 0,
        },
    ],
    series: typeOfCareSeries2,
    ...chartSplitYearsAndCategories,
};
