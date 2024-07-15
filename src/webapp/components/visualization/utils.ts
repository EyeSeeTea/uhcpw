import _ from "lodash";
import { SerieCustomization } from "./customization/types";

export function getSeriesChart(
    originalChartOptionsSeries: Highcharts.SeriesOptionsType[] | undefined,
    customizedOptionsSeries: SerieCustomization[] | undefined,
    sortLegendByLastDataPoint: boolean | undefined,
    hideLegendIfNoData: boolean | undefined
): Highcharts.SeriesOptionsType[] | undefined {
    const sortedSeries = sortSeriesByCustomization(customizedOptionsSeries, originalChartOptionsSeries);

    const seriesWithData = hideSeriesIfRequired(hideLegendIfNoData, sortedSeries);

    return sortLegendByLastDataPointIfRequired(sortLegendByLastDataPoint, seriesWithData);
}

function sortSeriesByCustomization(
    customizedOptionsSeries: SerieCustomization[] | undefined,
    originalChartOptionsSeries: Highcharts.SeriesOptionsType[] | undefined
): Highcharts.SeriesOptionsType[] | undefined {
    return customizedOptionsSeries
        ? _.orderBy(originalChartOptionsSeries, serie => {
              const serieCustomization = customizedOptionsSeries?.find(customSerie => serie.id === customSerie.id);
              return serieCustomization ? customizedOptionsSeries?.indexOf(serieCustomization) : 0;
          })
        : originalChartOptionsSeries;
}

function hideSeriesIfRequired(
    hideLegendIfNoData: boolean | undefined,
    sortedSeries: Highcharts.SeriesOptionsType[] | undefined
): Highcharts.SeriesOptionsType[] | undefined {
    return hideLegendIfNoData
        ? sortedSeries?.filter(serie => {
              const finalSerie = serie as any;
              const isDataSeriesEmpty =
                  !finalSerie?.data?.length ||
                  finalSerie?.data.every((dataPoint: number) => dataPoint === null || dataPoint === undefined);
              return !isDataSeriesEmpty;
          })
        : sortedSeries;
}

function sortLegendByLastDataPointIfRequired(
    sortLegendByLastDataPoint: boolean | undefined,
    seriesWithData: Highcharts.SeriesOptionsType[] | undefined
): Highcharts.SeriesOptionsType[] | undefined {
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

export function getCategories(xAxis: Highcharts.XAxisOptions | Highcharts.XAxisOptions[] | undefined): string[] {
    return Array.isArray(xAxis) ? xAxis[0]?.categories || [] : xAxis?.categories || [];
}
