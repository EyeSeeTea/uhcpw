import { buildCountryCategoriesByName } from "../builders/buildCountryCategoriesByName";
import { baseLegend } from "../legends/baseLegend";
import { ChartCustomization } from "../types";
import { rotateXAxis } from "../xAxis/rotateXAxis";

export const chart2Customizations: ChartCustomization = {
    title: { text: "" },
    legend: { ...baseLegend, reversed: true },
    series: [
        {
            id: "MDhStd9lvOc",
            name: "Further impoverished",
            color: "#c00000",
            dataLabels: {
                enabled: false,
            },
        },
        {
            id: "yKxOTGWUr4D",
            name: "Impoverished",
            color: "#e46c09",
            dataLabels: {
                enabled: false,
            },
        },
    ],
    countryXAxis: (countries, xAxis) => {
        const isNumber = !isNaN(Number(xAxis.categories[0]));

        return isNumber
            ? { ...rotateXAxis }
            : {
                  ...rotateXAxis,
                  categories: buildCountryCategoriesByName(countries, xAxis.categories),
              };
    },
};
