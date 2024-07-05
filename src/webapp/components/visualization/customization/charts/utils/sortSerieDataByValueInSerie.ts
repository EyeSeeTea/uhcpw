import { PointOptionsObject, SeriesColumnOptions } from "highcharts";
import _ from "lodash";

export function sortSerieDataByValueInSerie(
    series: SeriesColumnOptions[],
    serieId: string
): SeriesColumnOptions[] | undefined {
    const selectedSerie = series?.find(({ id }) => id === serieId);

    const selectedSerieData = selectedSerie ? selectedSerie.data : undefined;

    if (!selectedSerieData || selectedSerieData.length === 0) return series;

    const sortedSelectedData = _.orderBy(selectedSerieData, item => (item as PointOptionsObject).y || 0, ["asc"]);

    const sortedChartSeries = (series || [])?.map(serie => {
        const currentData = serie ? (serie.data as Highcharts.PointOptionsObject[]) : undefined;

        const data = sortedSelectedData?.map(dataItem => {
            return currentData?.find(data => dataItem && data.name === (dataItem as PointOptionsObject).name);
        });
        return { ...serie, data: _(data).compact().value() };
    });

    return sortedChartSeries;
}
