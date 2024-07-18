import { baseLegend } from "../legends/baseLegend";
import { linearHouseholdHealthQuintileSeries } from "../series/linearHouseholdHealthQuintileSeries";
import { ChartCustomization } from "../types";

export const chart_cGE32OzPgMS_Customizations: ChartCustomization = {
    title: { text: "" },
    legend: baseLegend,
    series: linearHouseholdHealthQuintileSeries,
    xAxis: { title: { text: "" } },
    yAxis: { title: { text: "Household (%)" } },
    sortLegendByLastDataPoint: true,
};
