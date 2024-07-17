import { baseLegend } from "../legends/baseLegend";
import { linearHouseholdHealthQuintileSeries } from "../series/linearHouseholdHealthQuintileSeries";
import { ChartCustomization } from "../types";

export const chart_pWFRTFfh5mA_Customizations: ChartCustomization = {
    title: { text: "" },
    legend: baseLegend,
    series: linearHouseholdHealthQuintileSeries,
    xAxis: { title: { text: "" } },
    yAxis: { title: { text: "Household budget (%)" } },
    sortLegendByLastDataPoint: true,
};
