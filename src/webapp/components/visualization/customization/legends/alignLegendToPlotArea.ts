import Highcharts from "highcharts";

type ChartWithLegendHeight = Highcharts.Chart & {
    legend: Highcharts.Chart["legend"] & { legendHeight?: number };
};

/**
 * Repositions a right-aligned, vertically-centered legend so it aligns to the plot area
 * instead of the full chart container. This is a workaround for the missing `alignTo: "plotBox"`
 * option in Highcharts <11. Remove this once Highcharts is upgraded to v11+.
 *
 * See: https://www.highcharts.com/forum/viewtopic.php?t=15197
 */
function alignLegendToPlotArea(chart: ChartWithLegendHeight): void {
    const { legend } = chart;
    if (!legend?.group || !legend.legendHeight) return;

    const options = chart.options.legend;
    const isRightMiddleVertical =
        options?.align === "right" && options?.verticalAlign === "middle" && options?.layout === "vertical";

    if (!isRightMiddleVertical) return;

    const legendCenter = chart.plotTop + chart.plotHeight / 2 - legend.legendHeight / 2;
    legend.group.attr({ translateY: legendCenter });
}

export function withLegendAlignment(existingEvents?: Highcharts.ChartEventsOptions): Highcharts.ChartEventsOptions {
    return {
        ...existingEvents,
        render(this: Highcharts.Chart, event: Event) {
            alignLegendToPlotArea(this as ChartWithLegendHeight);
            existingEvents?.render?.call(this, event);
        },
    };
}
