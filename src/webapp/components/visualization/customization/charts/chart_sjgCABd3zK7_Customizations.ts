import { baseLegend } from "../legends/baseLegend";
import { ChartCustomization } from "../types";
import { typeOfCareSeries3 } from "../series/typeOfCareSeries";

export const chart_sjgCABd3zK7_Customizations: ChartCustomization = {
    title: { text: "" },
    legend: baseLegend,
    series: typeOfCareSeries3,
    xAxis: { title: { text: "" } },
    sortLegendByLastDataPoint: true,
    currencyOfCountryYAxis: (countryCurrencyCode: string) => {
        return { title: { text: countryCurrencyCode } };
    },
};
