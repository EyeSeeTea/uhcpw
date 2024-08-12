import { SeriesColumnOptions } from "highcharts";
import _ from "lodash";
import { getSortedCategoriesOrderBySerieIdInLastYear } from "./getSortedCategoriesOrderBySerieIdInLastYear";

export function sortSerieDataByYearsAndCategories(
    series: SeriesColumnOptions[],
    categories: string[],
    sortingSerieId: string,
    categoriesPerYear: number
): SeriesColumnOptions[] | undefined {
    const customCategoriesOrder = getSortedCategoriesOrderBySerieIdInLastYear(
        series,
        categories,
        sortingSerieId,
        categoriesPerYear
    );

    // Add empty string for each categories year
    const categoriesWithLinesOffset = _.chunk(categories, customCategoriesOrder.length).flatMap(category => {
        return [...category, ""];
    });

    const seriesWithCategoryInData = series.map(serie => {
        if (serie.custom?.isTwoCategoryFakeSerie) return serie;
        return {
            ...serie,
            data: (serie.data || []).map((item, index) => {
                return {
                    x: index,
                    y: Array.isArray(item) && item.length > 1 ? item[1] || 0 : 0,
                    name: categoriesWithLinesOffset[index],
                };
            }),
        } as unknown as SeriesColumnOptions;
    });

    const categoriesWithSpacing = [...customCategoriesOrder, ""];
    return (seriesWithCategoryInData || [])?.flatMap(serie => {
        const currentData = serie ? (serie.data as Highcharts.PointOptionsObject[]) : undefined;

        const data = _(currentData)
            .chunk(categoriesWithSpacing.length)
            .flatMap(data => {
                return _.orderBy(data, dataItem => categoriesWithSpacing.indexOf(dataItem?.name?.toString() || ""));
            })
            .value();

        return { ...serie, data };
    });
}
