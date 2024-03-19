import { buildCountryCategoriesByName } from "../builders/buildCountryCategoriesByName";
import { baseLegend } from "../legends/baseLegend";
import { ChartCustomization } from "../types";
import { rotateXAxis } from "../xAxis/rotateXAxis";

export const chart7Customizations: ChartCustomization = {
    title: { text: "" },
    legend: { ...baseLegend, reversed: true },
    series: [
        { id: "SpTdfmqlzNj.CgeNM5PZBLy", name: "Medicines", color: "#c00000", dataLabels: { enabled: false } },
        {
            id: "SpTdfmqlzNj.WZQNt5d1TGm",
            name: "Medical products",
            color: "#ed7d31",
            dataLabels: { enabled: false },
        },
        { id: "SpTdfmqlzNj.bHGxnqq0s6M", name: "Dental care", color: "#0071c0", dataLabels: { enabled: false } },
        { id: "SpTdfmqlzNj.NYLedCi0SnS", name: "Inpatient care", color: "#00b050", dataLabels: { enabled: false } },
        {
            id: "SpTdfmqlzNj.JGYECk6mKHE",
            name: "Diagnostic tests",
            color: "#702fa0",
            dataLabels: { enabled: false },
        },
        {
            id: "SpTdfmqlzNj.xFBx8HXhRn6",
            name: "Outpatient care",
            color: "#ffc001",
            dataLabels: { enabled: false },
        },
    ],
    countryXAxis: (countries, xAxis) => {
        const isNumber = !isNaN(Number(xAxis.categories[0]));

        return isNumber
            ? {}
            : {
                  ...rotateXAxis,
                  categories: buildCountryCategoriesByName(countries, xAxis.categories),
              };
    },
};
