import { baseLegend } from "../../legends/baseLegend";
import { linearDentalQuintileSeries } from "../../series/linearDentalQuintileSeries";
import { rotateXAxis } from "../../xAxis/rotateXAxis";

export const linearDentalQuintileChart = {
    title: { text: "" },
    legend: baseLegend,
    series: linearDentalQuintileSeries,
    xAxis: { ...rotateXAxis },
};
