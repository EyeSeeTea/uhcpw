import { buildCountryCategoriesByName } from "../builders/buildCountryCategoriesByName";
import { ChartCustomization } from "../types";
import { rotateXAxis } from "../xAxis/rotateXAxis";

export const chart4Customizations: ChartCustomization = {
    title: { text: "" },
    legend: { enabled: false },
    allSeries: { color: "#00b050", dataLabels: { enabled: false } },
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
