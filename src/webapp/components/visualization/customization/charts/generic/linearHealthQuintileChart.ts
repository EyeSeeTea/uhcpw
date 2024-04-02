import { baseLegend } from "../../legends/baseLegend";
import { linearHealthQuintileSeries } from "../../series/linearHealthQuintileSeries";
import { rotateXAxis } from "../../xAxis/rotateXAxis";

export const linearHealthQuintileChart = {
    title: { text: "" },
    legend: baseLegend,
    series: linearHealthQuintileSeries,
    xAxis: { ...rotateXAxis },
};
