import { baseLegend } from "../legends/baseLegend";
import { linearDentalQuintileSeries } from "../series/linearDentalQuintileSeries";

export const linearDentalQuintileChart = {
    title: { text: "" },
    legend: { ...baseLegend, itemMarginTop: 20 },
    series: linearDentalQuintileSeries,
    xAxis: {
        title: { text: "" },
        labels: {
            rotation: -90,
        },
    },
};
