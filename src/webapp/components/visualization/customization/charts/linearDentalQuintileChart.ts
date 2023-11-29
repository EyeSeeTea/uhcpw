import { baseLegend } from "../legends/baseLegend";
import { linearDentalQuintileSeries } from "../series/linearDentalQuintileSeries";
import { rotateXAxis } from "../xAxis/rotateXAxis";

export const linearDentalQuintileChart = {
    title: { text: "" },
    legend: { ...baseLegend, itemMarginTop: 20 },
    series: linearDentalQuintileSeries,
    xAxis: { ...rotateXAxis },
};
