import { LegendCustomization } from "../types";

export const baseLegend = {
    enabled: true,
    align: "right",
    verticalAlign: "middle",
    layout: "vertical",
    alignTo: "plotBox",
    itemMarginTop: 10,
    itemMarginBottom: 10,
    itemStyle: {
        fontWeight: "normal",
        fontSize: "13px",
    },
} as LegendCustomization;
