import {
    sumSeriesData,
    getMaxValuesInSeriesData,
    getMaxAxisAndTickInterval,
} from "../../utils/getMaxAxisAndTickInterval";

export type SeriesWithData = {
    data: {
        color?: string | undefined;
        name: string;
        y: number;
    }[];
    name?: string;
    visible?: boolean;
    options?: {
        type: string;
    };
};

export function getMaxYAxisAndYTickInterval(
    series: SeriesWithData[],
    options?: {
        isStacked?: boolean;
        stackedValuesUpTo100?: boolean;
        maxValueUpTo100?: boolean;
    }
) {
    const { isStacked = false, stackedValuesUpTo100 = false, maxValueUpTo100 = false } = options || {};

    if (stackedValuesUpTo100) {
        return {
            max: 100,
            tickInterval: 20,
        };
    } else {
        const allYValuesInSeriesData = (series || []).map(serie => (serie.data || []).map(data => data.y));
        const columnSeriesData = isStacked
            ? sumSeriesData(allYValuesInSeriesData)
            : getMaxValuesInSeriesData(allYValuesInSeriesData);

        const { max, tickInterval } = getMaxAxisAndTickInterval(columnSeriesData);

        if (maxValueUpTo100 && max > 100) {
            return {
                max: 100,
                tickInterval: 20,
            };
        } else {
            return {
                max,
                tickInterval,
            };
        }
    }
}
