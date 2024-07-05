import { baseLegend } from "../legends/baseLegend";
import { typeOfCareSeries1 } from "../series/typeOfCareSeries";
import { ChartCustomization } from "../types";

//Not reuse with other charts with same series because in design is in different order
export const chart_qipBCG0Hc9Y_Customizations: ChartCustomization = {
    title: { text: "" },
    legend: { ...baseLegend, reversed: true },
    series: typeOfCareSeries1,
    xAxis: { title: { text: "" } },
};
