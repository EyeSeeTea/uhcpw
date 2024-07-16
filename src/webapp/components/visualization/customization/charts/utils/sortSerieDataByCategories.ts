import { SeriesColumnOptions } from "highcharts";
import _ from "lodash";

export function sortSerieDataByCategories(
    series: SeriesColumnOptions[],
    categories: string[]
): SeriesColumnOptions[] | undefined {
    const sortedChartSeries = (series || [])?.map(serie => {
        const currentData = serie ? (serie.data as Highcharts.PointOptionsObject[]) : undefined;

        const data = _.orderBy(currentData, dataItem => categories.indexOf(dataItem?.name?.toString() || ""));
        return { ...serie, data: _(data).compact().value() };
    });

    return sortedChartSeries;
}
