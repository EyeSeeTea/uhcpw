import { baseLegend } from "../../legends/baseLegend";
import { linearHealthQuintileSeries } from "../../series/linearHealthQuintileSeries";

export const linearHealthQuintileChart = {
    title: { text: "" },
    legend: baseLegend,
    series: linearHealthQuintileSeries,
    xAxis: { title: { text: "" } },
    sortLegendByLastDataPoint: true,
};
