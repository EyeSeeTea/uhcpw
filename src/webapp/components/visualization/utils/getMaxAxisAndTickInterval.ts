import { getMaxYAxisAndYTickIntervalForStackedColumnsInChartSplitYearsAndCategories } from "../customization/yAxis/getMaxYAxisAndYTickInterval";
import { getMaxYAxisAndYTickInterval, SeriesWithData } from "../manual/utils/getMaxYAxisAndYTickInterval";

export function getMaxXAxisValue(data: number[], tickInterval?: number): number {
    const maxXValue = Math.max(...data);
    const tick = tickInterval || (maxXValue <= 1 ? 0.2 : maxXValue <= 5 ? 1 : 5);
    return Math.ceil(maxXValue / tick) * tick;
}

export function getXTickInterval(maxXAxis: number) {
    switch (true) {
        case maxXAxis <= 1:
            return 0.2;
        case maxXAxis <= 5:
            return 1;
        case maxXAxis <= 10:
            return 2;
        case maxXAxis <= 24:
            return 4;
        case maxXAxis <= 45:
            return 5;
        case maxXAxis <= 80:
            return 10;
        case maxXAxis <= 90:
            return 15;
        default:
            return 20;
    }
}

export function getRoundedMaxValue(maxValue: number): number {
    const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue)));
    const factor = maxValue <= 100 ? (maxValue <= 1 ? 1 : 5) : magnitude;

    return Math.ceil(maxValue / factor) * factor;
}

export function getTickIntervalByMaxAxisValue(maxAxisValue: number): number {
    if (maxAxisValue <= 1) return 0.2;
    if (maxAxisValue <= 5) return 1;
    if (maxAxisValue <= 10) return 2;

    const magnitude = Math.floor(Math.log10(maxAxisValue));
    const baseInterval = 10 ** magnitude;

    if (maxAxisValue <= 1 * baseInterval) return baseInterval * 0.2;
    if (maxAxisValue <= 2.4 * baseInterval) return baseInterval * 0.4;
    if (maxAxisValue <= 4.5 * baseInterval) return baseInterval * 0.5;
    if (maxAxisValue <= 8 * baseInterval) return baseInterval * 1;
    if (maxAxisValue <= 9 * baseInterval) return baseInterval * 1.5;

    return baseInterval * 2;
}

// NOTICE: At the moment the max value will be the maximum value of the chart instead of auto-calculating.
export function getMaxAxisAndTickInterval(
    maxValuesInSeriesData: number[],
    stackedValuesUpTo100?: boolean
): { max: number; tickInterval: number } {
    if (maxValuesInSeriesData.length === 0) {
        return { max: 0, tickInterval: 0 };
    }

    if (stackedValuesUpTo100) {
        return {
            max: 100,
            tickInterval: 20,
        };
    }

    const maxAxisValue = Math.max(...maxValuesInSeriesData) === 0 ? 1 : Math.max(...maxValuesInSeriesData);
    // const maxAxisRoundedValue = getRoundedMaxValue(maxAxisValue);

    const tickInterval = getTickIntervalByMaxAxisValue(maxAxisValue);

    return {
        // max: Math.ceil(maxAxisRoundedValue / tickInterval) * tickInterval,
        max: maxAxisValue,
        tickInterval: tickInterval,
    };
}

export function sumSeriesData(seriesData: (number | null)[][]): number[] {
    const maxLength = Math.max(...seriesData.map(arr => arr.length));

    return Array.from({ length: maxLength }, (_, i) => seriesData.reduce((sum, arr) => sum + (arr[i] || 0), 0));
}

export function getMaxValuesInSeriesData(seriesData: number[][]): number[] {
    const maxLength = Math.max(...seriesData.map(arr => arr.length));

    return Array.from({ length: maxLength }, (_, i) => seriesData.reduce((max, arr) => Math.max(max, arr[i] || 0), 0));
}

export function isNumberData(value: unknown): value is number {
    return typeof value === "number" && !isNaN(value);
}

export function setYAxisMaxAxisAndTickIntervalWhenLegendItemClick(
    series: Highcharts.Series,
    options?: {
        isStacked?: boolean;
        stackedValuesUpTo100?: boolean;
        maxValueUpTo100?: boolean;
    }
): boolean {
    const { isStacked = false, stackedValuesUpTo100 = false, maxValueUpTo100 = false } = options || {};
    const isSelectedSerieHide = series.visible;
    const selectedSerieIndex = series.index;
    const seriesInChart = series.chart.series as SeriesWithData[];

    const visibleSeries = seriesInChart.filter((serie, index) => {
        const isSelectedSerie = index === selectedSerieIndex;
        const isSelectedSerieVisible = !isSelectedSerieHide && isSelectedSerie;
        const isNotSelectedSeriesVisible = !isSelectedSerie && serie.visible;
        return isSelectedSerieVisible || isNotSelectedSeriesVisible;
    });

    const { max: adjustedMaxYAxis, tickInterval: yTickInterval } = getMaxYAxisAndYTickInterval(visibleSeries, {
        isStacked,
        stackedValuesUpTo100,
    });

    if (maxValueUpTo100 && adjustedMaxYAxis > 100) {
        series.chart.yAxis.forEach(yAxis => {
            yAxis.update({
                max: 100,
                tickInterval: 20,
            });
        });
    } else {
        series.chart.yAxis.forEach(yAxis => {
            yAxis.update({
                max: adjustedMaxYAxis,
                tickInterval: yTickInterval,
            });
        });
    }

    return true;
}

export function setYAxisMaxAxisAndTickIntervalWhenLegendItemClickInChartSplitYearsAndCategories(
    series: Highcharts.Series,
    options?: {
        maxValueUpTo100?: boolean;
    }
): boolean {
    const { maxValueUpTo100 = false } = options || {};
    const isSelectedSerieHide = series.visible;
    const selectedSerieIndex = series.index;
    const seriesInChart = series.chart.series as SeriesWithData[];

    const visibleSeries = seriesInChart.filter((serie, index) => {
        const isSelectedSerie = index === selectedSerieIndex;
        const isSelectedSerieVisible = !isSelectedSerieHide && isSelectedSerie;
        const isNotSelectedSeriesVisible = !isSelectedSerie && serie.visible;
        return isSelectedSerieVisible || isNotSelectedSeriesVisible;
    });

    const { max: adjustedMaxYAxis, tickInterval: yTickInterval } =
        getMaxYAxisAndYTickIntervalForStackedColumnsInChartSplitYearsAndCategories(
            visibleSeries as Highcharts.SeriesColumnOptions[]
        );

    if (maxValueUpTo100 && adjustedMaxYAxis > 100) {
        series.chart.yAxis.forEach(yAxis => {
            yAxis.update({
                max: 100,
                tickInterval: 20,
            });
        });
    } else {
        series.chart.yAxis.forEach(yAxis => {
            yAxis.update({
                max: adjustedMaxYAxis,
                tickInterval: yTickInterval,
            });
        });
    }

    return true;
}
