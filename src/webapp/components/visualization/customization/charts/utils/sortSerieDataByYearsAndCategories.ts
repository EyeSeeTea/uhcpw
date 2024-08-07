import { SeriesColumnOptions } from "highcharts";
import _ from "lodash";

export function sortSerieDataByYearsAndCategories(
    series: SeriesColumnOptions[],
    categories: string[]
): SeriesColumnOptions[] | undefined {
    const sortedChartSeries = (series || [])?.flatMap(serie => {
        const currentData = serie ? (serie.data as Highcharts.PointOptionsObject[]) : undefined;

        const data = _(currentData)
            .chunk(categories.length)
            .flatMap(data => {
                return _.orderBy(data, dataItem => categories.indexOf(dataItem?.name?.toString() || ""));
            })
            .value();

        return { ...serie, data };
    });

    return sortedChartSeries;
}
