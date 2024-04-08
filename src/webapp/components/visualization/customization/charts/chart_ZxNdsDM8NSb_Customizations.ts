import { baseLegend } from "../legends/baseLegend";
import { ChartCustomization } from "../types";

export const chart_ZxNdsDM8NSb_Customizations: ChartCustomization = {
    title: { text: "" },
    legend: { ...baseLegend, reversed: true },
    xAxis: [
        {
            lineWidth: 0,
        },
        {
            lineWidth: 0,
        },
    ],
    series: [
        { id: "qgE5NJ9Nyaq", name: "Medicines", color: "#c00000", dataLabels: { enabled: false } },
        { id: "a2u2ccahVJL", name: "Dental care", color: "#0070c0", dataLabels: { enabled: false } },
        { id: "OuiKmOeXUWQ", name: "Medical products", color: "#ed7d31", dataLabels: { enabled: false } },
        { id: "OEK4dKvUsOe", name: "Inpatient care", color: "#00b050", dataLabels: { enabled: false } },
        { id: "ykAPKvVQusS", name: "Outpatient care", color: "#ffc000", dataLabels: { enabled: false } },
        { id: "qy4W8ZY2g5M", name: "Diagnostic tests", color: "#7030a0", dataLabels: { enabled: false } },
    ],
    chart: {
        events: {
            load: function (this: Highcharts.Chart) {
                const xAxis1 = this.xAxis[1];

                if (xAxis1?.ticks[-1]?.gridLine) {
                    xAxis1?.ticks[-1]?.gridLine?.hide();
                }

                const xAxis1TotalTicks = xAxis1?.tickPositions ? xAxis1?.tickPositions?.length : undefined;
                const xAxis1LastValueTick =
                    xAxis1?.tickPositions && xAxis1TotalTicks ? xAxis1?.tickPositions[xAxis1TotalTicks - 1] : undefined;

                if (xAxis1LastValueTick !== undefined && xAxis1?.ticks[xAxis1LastValueTick]?.gridLine) {
                    xAxis1?.ticks[xAxis1LastValueTick]?.gridLine?.hide();
                }

                const yAxis = this.yAxis[0];
                const yAxisFirstValueTick =
                    yAxis?.tickPositions && yAxis?.tickPositions[0] !== undefined ? yAxis?.tickPositions[0] : undefined;

                if (yAxisFirstValueTick !== undefined && yAxis?.ticks[yAxisFirstValueTick]?.gridLine) {
                    yAxis?.ticks[yAxisFirstValueTick]?.gridLine?.hide();
                }

                const yAxisTotalTicks = yAxis?.tickPositions ? yAxis?.tickPositions?.length : undefined;
                const yAxisLastValueTick =
                    yAxis?.tickPositions && yAxisTotalTicks ? yAxis?.tickPositions[yAxisTotalTicks - 1] : undefined;

                if (yAxisLastValueTick !== undefined && yAxis?.ticks[yAxisLastValueTick]?.gridLine) {
                    yAxis?.ticks[yAxisLastValueTick]?.gridLine?.hide();
                }
            },
        },
    },
};
