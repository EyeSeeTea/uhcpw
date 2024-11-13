import { SeriesColumnOptions } from "highcharts";
import {
    getMaxAxisAndTickInterval,
    getMaxValuesInSeriesData,
    isNumberData,
    sumSeriesData,
} from "../../utils/getMaxAxisAndTickInterval";

export function getMaxYAxisAndYTickIntervalForStackedColumns(
    series: SeriesColumnOptions[] | undefined,
    maxValueUpTo100?: boolean
):
    | {
          max: number;
          tickInterval: number;
      }
    | undefined {
    const seriesNumberData = series
        ?.map(serie => serie.data)
        .map(serieData => (serieData || [])?.map(data => (isNumberData(data) ? data : 0)));

    if (seriesNumberData) {
        const sumOfSeriesData = sumSeriesData(seriesNumberData);
        const { max, tickInterval } = getMaxAxisAndTickInterval(sumOfSeriesData);

        return maxValueUpTo100 && max > 100 ? { max: 100, tickInterval: 20 } : { max, tickInterval };
    }
}

type ChartSeriesWithYData = {
    data: {
        name: string;
        y: number;
    }[];
};

export function getMaxYAxisAndYTickIntervalForStackedColumnsWithYData(
    series: SeriesColumnOptions[] | undefined,
    stackedValuesUpTo100?: boolean
):
    | {
          max: number;
          tickInterval: number;
      }
    | undefined {
    const seriesNumberData = (series as ChartSeriesWithYData[])
        ?.map(serie => serie.data)
        .map(serieData => (serieData || [])?.map(data => (isNumberData(data?.y) ? data?.y : 0)));

    if (seriesNumberData) {
        const sumOfSeriesData = sumSeriesData(seriesNumberData);
        return getMaxAxisAndTickInterval(sumOfSeriesData, stackedValuesUpTo100);
    }
}

export function getMaxYAxisAndYTickIntervalForStackedColumnsInChartSplitYearsAndCategories(
    series: SeriesColumnOptions[] | undefined,
    options?: {
        maxValueUpTo100?: boolean;
    }
): {
    max: number;
    tickInterval: number;
} {
    const { maxValueUpTo100 = false } = options ?? {};
    const sumYDataByCategoryAndChart = (series as ChartSeriesWithYData[])?.reduce((accSerie, serie) => {
        const yDataByCategoryAndChart = serie.data?.reduce((acc, data) => {
            const categoryName = data?.name;
            if (!categoryName) return acc;

            const maxChartNumberOfCurrentCategory = Object.keys(acc).reduce((maxKey, key) => {
                const [keyCategoryName, keyChartNumber] = key.split("-");
                return keyCategoryName === categoryName && keyChartNumber
                    ? Math.max(maxKey, parseInt(keyChartNumber))
                    : maxKey;
            }, 1);

            const yData = data?.y ?? 0;
            const firstChartNumber = 1;
            const key = `${categoryName}-${maxChartNumberOfCurrentCategory}`;
            if (acc[key]) {
                const splitKey = key.split("-");
                const chartNumber = splitKey[1] ? parseInt(splitKey[1]) : firstChartNumber;

                const newKey = `${categoryName}-${chartNumber + 1}`;
                return {
                    ...acc,
                    [newKey]: yData,
                };
            } else {
                return {
                    ...acc,
                    [key]: yData,
                };
            }
        }, {} as Record<string, number>);

        return Object.keys(yDataByCategoryAndChart).reduce((acc, key) => {
            const yData = yDataByCategoryAndChart[key];
            if (!yData && yData !== 0) return acc;
            if (accSerie[key]) {
                return {
                    ...acc,
                    [key]: (accSerie[key] ?? 0) + yData,
                };
            } else {
                return {
                    ...acc,
                    [key]: yData,
                };
            }
        }, accSerie);
    }, {} as Record<string, number>);

    const maxYDataByChart = Object.keys(sumYDataByCategoryAndChart).reduce((acc, categoryByChartKey: string) => {
        const [categoryName, chartKey] = categoryByChartKey.split("-");
        const yData = sumYDataByCategoryAndChart[categoryByChartKey];

        if (!chartKey || !categoryName || (!yData && yData !== 0)) return acc;

        if (acc[chartKey]) {
            return {
                ...acc,
                [chartKey]: Math.max(acc[chartKey] ?? 0, yData),
            };
        } else {
            return {
                ...acc,
                [chartKey]: yData,
            };
        }
    }, {} as Record<string, number>);

    const maxYDataValuesInCharts = Object.values(maxYDataByChart);

    const { max, tickInterval } = getMaxAxisAndTickInterval(maxYDataValuesInCharts);

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

export function getMaxYAxisAndYTickIntervalForLineAndColumns(series: SeriesColumnOptions[] | undefined):
    | {
          max: number;
          tickInterval: number;
      }
    | undefined {
    const seriesNumberData = series
        ?.map(serie => serie.data)
        .map(serieData => (serieData || [])?.map(data => (isNumberData(data) ? data : 0)));

    if (seriesNumberData) {
        const maxValuesInSeriesData = getMaxValuesInSeriesData(seriesNumberData);
        return getMaxAxisAndTickInterval(maxValuesInSeriesData);
    }
}

export function getMaxYAxisAndYTickIntervalForGroupedColumns(series: SeriesColumnOptions[] | undefined):
    | {
          max: number;
          tickInterval: number;
      }
    | undefined {
    const columnSeriesData = series?.flatMap(serie => serie.custom?.data || []) as (number | null)[][];
    const seriesNumberData = columnSeriesData.map(serieData => serieData.map(data => (isNumberData(data) ? data : 0)));

    if (seriesNumberData) {
        const maxValuesInSeriesData = getMaxValuesInSeriesData(seriesNumberData);
        return getMaxAxisAndTickInterval(maxValuesInSeriesData);
    }
}
