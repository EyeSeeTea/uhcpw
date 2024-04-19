import { baseLegend } from "../../legends/baseLegend";
import { createCountrySerie } from "../../builders/buildCountrySerie";
import { ChartCustomization } from "../../types";

export const linearByCountryChart: ChartCustomization = {
    title: { text: "" },
    legend: { ...baseLegend },
    countrySerie: createCountrySerie,
    xAxis: {
        title: { text: "" },
    },
    sortLegendByLastDataPoint: true,
    hideLegendIfNoData: true,
};
