import { baseLegend } from "../legends/baseLegend";
import { linearQuintileSeries } from "../series/linearQuintileSeries";

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
