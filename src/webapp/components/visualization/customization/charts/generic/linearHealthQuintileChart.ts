import { baseLegend } from "../../legends/baseLegend";
import { linearHealthQuintileSeries } from "../../series/linearHealthQuintileSeries";
import { rotateXAxis } from "../../xAxis/rotateXAxis";

export const linearHealthQuintileChart = {
    title: { text: "" },
    legend: { ...baseLegend, itemMarginTop: 20 },
    series: linearHealthQuintileSeries,
    xAxis: { ...rotateXAxis },
};
