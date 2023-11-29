import { buildCountryCategoriesByName } from "../builders/buildCountryCategoriesByName";
import { baseLegend } from "../legends/baseLegend";
import { ChartCustomization } from "../types";
import { rotateXAxis } from "../xAxis/rotateXAxis";

export const chart5Customizations: ChartCustomization = {
    title: { text: "" },
    legend: { ...baseLegend },
    series: [
        {
            id: "GeiKSyJLeKt",
            name: "Poorest",
            color: "#203864",
            dataLabels: { enabled: false },
        },
        {
            id: "GuypYXqveWn",
            name: "2nd",
            color: "#2f5597",
            dataLabels: { enabled: false },
        },
        {
            id: "ii0MC8x9D7i",
            name: "3rd",
            color: "#4472c4",
            dataLabels: { enabled: false },
        },
        {
            id: "O0MXmTdpf4m",
            name: "4th",
            color: "#8fa2d4",
            dataLabels: { enabled: false },
        },
        {
            id: "yiucIy5NIAw",
            name: "Richest",
            color: "#bac4e2",
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
