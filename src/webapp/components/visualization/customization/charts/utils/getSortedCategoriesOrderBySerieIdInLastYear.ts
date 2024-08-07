import { SeriesColumnOptions } from "highcharts";
import _ from "lodash";

export function getSortedCategoriesOrderBySerieIdInLastYear(
    series: SeriesColumnOptions[] | undefined,
    categories: string[],
    serieId: string,
    totalCategories: number
): string[] {
    const selectedSerieForTheSorting = series?.find(({ id }) => id === serieId);

    const lastYearAvailableData: (number | null)[] =
        selectedSerieForTheSorting?.custom?.data?.[selectedSerieForTheSorting?.custom?.data.length - 1] || [];

    const lastYearAvailableCategoriesOrder = categories.slice(-totalCategories);

    const mergedDataAndOrder = lastYearAvailableCategoriesOrder.map((category, index) => {
        return {
            category,
            value: lastYearAvailableData[index] || 0,
        };
    });

    return _.orderBy(mergedDataAndOrder, item => (!item.value ? Infinity : item.value), ["asc"]).map(
        item => item.category
    );
}
