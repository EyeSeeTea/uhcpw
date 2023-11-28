import { baseLegend } from "../legends/baseLegend";
import { createCountrySerie } from "../builders/buildCountrySerie";
import { ChartCustomization } from "../types";
import { yearXAxis } from "../xAxis/yearXAxis";

export const linearByCountryChart: ChartCustomization = {
    title: { text: "" },
    legend: { ...baseLegend, reversed: true },
    countrySerie: createCountrySerie,
    xAxis: {
        ...yearXAxis,
    },
};
