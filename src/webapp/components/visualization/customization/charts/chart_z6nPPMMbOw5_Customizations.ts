import { baseLegend } from "../legends/baseLegend";
import { ChartCustomization } from "../types";
import { sortSerieDataByYearsAndCategories } from "./utils/sortSerieDataByYearsAndCategories";
import { chartSplitYearsAndCategories } from "../xAxis/chartSplitYearsAndCategories";

const CATEGORY_ID_BY_NAME = {
    "Dental care": "a2u2ccahVJL",
    "Inpatient care": "OEK4dKvUsOe",
    "Diagnostic tests": "qy4W8ZY2g5M",
    Medicines: "qgE5NJ9Nyaq",
    "Medical products": "OuiKmOeXUWQ",
    "Outpatient care": "ykAPKvVQusS",
};

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
            labels: {
                style: {
                    fontSize: "12px", // Change the x-axis label font size
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

        return sortSerieDataByYearsAndCategories(
            series,
            categories,
            "S0rJgTIK3Gv",
            Object.keys(CATEGORY_ID_BY_NAME).length
        );
    },
    ...chartSplitYearsAndCategories,
};
