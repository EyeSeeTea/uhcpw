import { LegendOptions } from "highcharts";
import { baseLegend } from "./baseLegend";

export const topLegend = {
    ...baseLegend,
    align: "center",
    verticalAlign: "top",
    layout: "horizontal",
} as LegendOptions;
