import { baseLegend } from "../../legends/baseLegend";
import { createCountrySerie } from "../../builders/buildCountrySerie";
import { ChartCustomization } from "../../types";
import { rotateXAxis } from "../../xAxis/rotateXAxis";

export const linearByCountryChart: ChartCustomization = {
    title: { text: "" },
    legend: { ...baseLegend, reversed: true },
    countrySerie: createCountrySerie,
    xAxis: {
        ...rotateXAxis,
    },
};
