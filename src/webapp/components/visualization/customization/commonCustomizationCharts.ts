import { baseLegend } from "./baseLegend";
import { createCountrySerie } from "./createCountrySerie";
import { linearQuintileSeries } from "./linearQuintileSeries";

export const linearByCountryChart = {
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

export const linearQuintileChart = {
    title: { text: "" },
    legend: { ...baseLegend, itemMarginTop: 20 },
    series: linearQuintileSeries,
    xAxis: {
        title: { text: "" },
        labels: {
            rotation: -90,
        },
    },
};
