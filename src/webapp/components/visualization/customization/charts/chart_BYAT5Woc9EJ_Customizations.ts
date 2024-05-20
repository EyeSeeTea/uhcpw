import { ChartCustomization } from "../types";
import { linearByCountryChart } from "./generic/linearByCountryChart";

export const chart_BYAT5Woc9EJ_Customizations: ChartCustomization = {
    ...linearByCountryChart,
    yAxis: {
        title: {
            text: "GDP (%)",
            style: { fontSize: "13px" },
        },
    },
};
