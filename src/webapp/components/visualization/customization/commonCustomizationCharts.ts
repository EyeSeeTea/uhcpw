import { createCountrySerie } from "./createCountrySerie";
import { linearQuintileSeries } from "./linearQuintileSeries";
import { baseLegend } from "./types";

export const linearByCountryChart = {
    title: { text: "" },
    legend: { ...baseLegend, reversed: true },
    countrySerie: createCountrySerie,
    xAxis: {
        labels: {
            rotation: -90,
        },
    },
};

export const linearQuintileChart = {
    title: { text: "" },
    legend: { ...baseLegend, itemMarginTop: 20 },
    series: linearQuintileSeries,
    xAxis: {
        title: "",
        labels: {
            rotation: -90,
        },
    },
};
