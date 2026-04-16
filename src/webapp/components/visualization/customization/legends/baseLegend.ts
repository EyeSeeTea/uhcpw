import { LEGEND_SYMBOL_RADIUS, LEGEND_SYMBOL_SIZE } from "../chartConstants";
import { LegendCustomization } from "../types";

export const baseLegend = {
    enabled: true,
    align: "right",
    verticalAlign: "middle",
    layout: "vertical",
    itemMarginTop: 10,
    itemMarginBottom: 10,
    symbolHeight: LEGEND_SYMBOL_SIZE,
    symbolWidth: LEGEND_SYMBOL_SIZE,
    symbolRadius: LEGEND_SYMBOL_RADIUS,
    itemStyle: {
        fontWeight: "normal",
        fontSize: "13px",
    },
} as LegendCustomization;
