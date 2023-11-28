import { baseLegend } from "../legends/baseLegend";
import { linearHealthQuintileSeries } from "../series/linearHealthQuintileSeries";
import { yearXAxis } from "../xAxis/yearXAxis";

export const linearHealthQuintileChart = {
    title: { text: "" },
    legend: { ...baseLegend, itemMarginTop: 20 },
    series: linearHealthQuintileSeries,
    xAxis: { ...yearXAxis },
};
