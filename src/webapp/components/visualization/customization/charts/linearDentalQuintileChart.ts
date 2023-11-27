import { baseLegend } from "../legends/baseLegend";
import { linearDentalQuintileSeries } from "../series/linearDentalQuintileSeries";
import { yearXAxis } from "../xAxis/yearXAxis";

export const linearDentalQuintileChart = {
    title: { text: "" },
    legend: { ...baseLegend, itemMarginTop: 20 },
    series: linearDentalQuintileSeries,
    xAxis: { ...yearXAxis },
};
