import { SeriesColumnOptions } from "highcharts";
import { ChartCustomization } from "../types";
import { getMaxYAxisAndYTickIntervalForLineAndColumns } from "../yAxis/getMaxYAxisAndYTickInterval";

export const chart_Y31jQX5PVdI_Customizations: ChartCustomization = {
    title: { text: "" },
    legend: { enabled: false },
    series: [
        {
            id: "WmOGqGcov4f",
            name: "Households with catastrophic health spending",
            color: "#185698",
            dataLabels: { enabled: false },
        },
    ],
    getMaxYAxisAndYTickInterval: (series: SeriesColumnOptions[] | undefined) => {
        return getMaxYAxisAndYTickIntervalForLineAndColumns(series);
    },
};
