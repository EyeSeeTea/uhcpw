import _ from "lodash";
import { SerieCustomization } from "./customization/types";

export function getSeriesChart(
    originalChartOptionsSeries: Highcharts.SeriesOptionsType[] | undefined,
    customizedOptionsSeries: SerieCustomization[] | undefined,
    sortLegendByLastDataPoint: boolean | undefined,
    hideLegendIfNoData: boolean | undefined
): Highcharts.SeriesOptionsType[] | undefined {
    const sortedSeries = customizedOptionsSeries
        ? _.orderBy(originalChartOptionsSeries, serie => {
              const serieCustomization = customizedOptionsSeries?.find(customSerie => serie.id === customSerie.id);
              return serieCustomization ? customizedOptionsSeries?.indexOf(serieCustomization) : 0;
          })
        : originalChartOptionsSeries;

    const seriesWithData = hideLegendIfNoData
        ? sortedSeries?.filter(serie => {
              const finalSerie = serie as any;
              const isDataSeriesEmpty =
                  !finalSerie?.data?.length ||
                  finalSerie?.data.every((dataPoint: number) => dataPoint === null || dataPoint === undefined);
              return !isDataSeriesEmpty;
          })
        : sortedSeries;

    return sortLegendByLastDataPoint
        ? _.orderBy(
              seriesWithData,
              serie => {
                  const finalSerie = serie as any;
                  const seriesDataWithNumbers = finalSerie.data.filter(
                      (dataPoint: number) => dataPoint !== null && dataPoint !== undefined
                  );
                  return seriesDataWithNumbers?.length ? seriesDataWithNumbers?.[seriesDataWithNumbers.length - 1] : 0;
              },
              "desc"
          )
        : seriesWithData;
}
