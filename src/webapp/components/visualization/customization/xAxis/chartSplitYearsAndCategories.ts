import { ChartCustomization } from "../types";
import _ from "lodash";

function getFontSize(dataLength: number): string {
    if (dataLength <= 20) return "12px";
    if (dataLength <= 55) return "10px";
    if (dataLength <= 100) return "8px";
    return "6px"; // Fallback for larger datasets
}

function getLabelRotation(dataLength: number): number {
    if (dataLength < 20) return 0;
    return -90;
}

/**
 * Maps tick positions, transforming the array to have mirrored negative and positive values, between max interval.
 *
 * Examples:
 * tickPositions = [0, 1, 2, 3, 4] with interval = 10 expected result with symmetry: [-10, -5, 5, 10]
 * tickPositions = [0, 1, 2, 3] with interval = 10 expected result with symmetry: [-10, 0, 10]
 */
function buildGridLinesTranslationMap(tickPositions: number[] | undefined) {
    if (!tickPositions) return [];
    const [, ...ticks] = tickPositions; // Remove 0 at the beginning

    const len = ticks.length;
    const halfLen = _.floor(len / 2);
    const isEven = len % 2 === 0;

    // Calculate interval with linear function so that the furthest ticks are at +/- maxInterval
    const maxInterval = 13;
    const linearConstant = -0.5;
    const linearInterval = linearConstant * len + maxInterval;
    const interval = linearInterval / halfLen;

    // Generate the negative and positive halves
    const halfTicks = _(ticks).take(halfLen).value();
    const negativeHalf = halfTicks.map(t => -1 * t * interval).reverse();
    const positiveHalf = halfTicks.map(t => t * interval);

    // Return combined array depending on whether the length is even or odd
    return isEven ? [...negativeHalf, ...positiveHalf] : [...negativeHalf, 0, ...positiveHalf];
}

export const chartSplitYearsAndCategories: Pick<ChartCustomization, "chart"> = {
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

                // Adjust gridLine positions
                const gridLinesTranslations = buildGridLinesTranslationMap(xAxis1?.tickPositions);
                xAxis1?.tickPositions?.forEach((tick, index) => {
                    const gridLine = xAxis1?.ticks[tick]?.gridLine;
                    const gridLineTranslation = gridLinesTranslations[index];
                    if (gridLine && gridLineTranslation) {
                        gridLine.translate(gridLineTranslation, 0);
                    }
                });

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
            render: function () {
                const xAxis = this.xAxis[0];
                const series = this.series[0];
                if (series && series.data && xAxis) {
                    const dataLength = series.data.length;
                    const fontSize = getFontSize(dataLength);
                    const labelRotation = getLabelRotation(dataLength);
                    // Update x-axis labels font size and rotation
                    if (
                        fontSize !== xAxis.options.labels?.style?.fontSize ||
                        labelRotation !== xAxis.options.labels?.rotation
                    ) {
                        xAxis.update({
                            labels: {
                                style: {
                                    fontSize: fontSize,
                                },
                                rotation: labelRotation,
                            },
                        });
                    }
                }
            },
        },
    },
};
