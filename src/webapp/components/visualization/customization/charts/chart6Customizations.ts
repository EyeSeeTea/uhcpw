import { buildCountryCategoriesByName } from "../builders/buildCountryCategoriesByName";
import { baseLegend } from "../legends/baseLegend";
import { ChartCustomization } from "../types";
import { rotateXAxis } from "../xAxis/rotateXAxis";

export const chart6Customizations: ChartCustomization = {
    title: { text: "" },
    legend: { ...baseLegend, reversed: true, itemMarginTop: 20 },
    series: [
        { id: "qgE5NJ9Nyaq", name: "Medicines", color: "#c00000", dataLabels: { enabled: false } },
        { id: "OuiKmOeXUWQ", name: "Medical products", color: "#ed7d31", dataLabels: { enabled: false } },
        { id: "a2u2ccahVJL", name: "Dental care", color: "#0071c0", dataLabels: { enabled: false } },
        { id: "OEK4dKvUsOe", name: "Inpatient care", color: "#00b050", dataLabels: { enabled: false } },
        { id: "qy4W8ZY2g5M", name: "Diagnostic tests", color: "#702fa0", dataLabels: { enabled: false } },
        { id: "ykAPKvVQusS", name: "Outpatient care", color: "#ffc001", dataLabels: { enabled: false } },
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
