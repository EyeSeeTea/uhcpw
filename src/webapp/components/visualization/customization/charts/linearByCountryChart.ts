import { baseLegend } from "../legends/baseLegend";
import { createCountrySerie } from "../builders/buildCountrySerie";
import { ChartCustomization } from "../types";

export const linearByCountryChart: ChartCustomization = {
    title: { text: "" },
    legend: { ...baseLegend, reversed: true },
    countrySerie: createCountrySerie,
    xAxis: {
        labels: {
            rotation: -90,
        },
        title: { text: "" },
    },
};
