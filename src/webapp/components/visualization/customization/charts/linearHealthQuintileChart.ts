import { baseLegend } from "../legends/baseLegend";
import { linearHealthQuintileSeries,  } from "../series/linearHealthQuintileSeries";

export const linearHealthQuintileChart = {
    title: { text: "" },
    legend: { ...baseLegend, itemMarginTop: 20 },
    series: linearHealthQuintileSeries,
    xAxis: {
        title: { text: "" },
        labels: {
            rotation: -90,
        },
    },
};
