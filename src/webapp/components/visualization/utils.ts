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

export function filterEmptyYearsInSeries(options: Highcharts.Options): Highcharts.Options {
    const categories = getCategories(options.xAxis);

    const someFirstOrLastDataIsNull = (options.series as Array<Highcharts.SeriesLineOptions>)?.some(serie => {
        if (serie?.custom?.isTwoCategoryFakeSerie) {
            return false;
        } else {
            return (
                serie.data?.[0] === null ||
                serie.data?.[0] === undefined ||
                (serie.data?.length === categories.length && serie.data?.[categories.length - 1] === null)
            );
        }
    });

    if (!someFirstOrLastDataIsNull) {
        return options;
    }

    const { firstIndex, lastIndex } = (options.series as Array<Highcharts.SeriesLineOptions>)?.reduce((acc, serie) => {
        const firstIndexWithData = (serie.data || [])?.findIndex(
            dataPoint => dataPoint !== null && dataPoint !== undefined
        );
        const lastIndexWithDataReverse = [...(serie.data || [])]
            ?.reverse()
            ?.findIndex(dataPoint => dataPoint !== null && dataPoint !== undefined);

        const lastIndexWithData =
            lastIndexWithDataReverse === -1 ? -1 : (serie.data || []).length - 1 - lastIndexWithDataReverse;

        return {
            firstIndex: !acc.firstIndex
                ? firstIndexWithData
                : firstIndexWithData < acc.firstIndex
                ? firstIndexWithData
                : acc.firstIndex,
            lastIndex: !acc.lastIndex
                ? lastIndexWithData
                : lastIndexWithData > acc.lastIndex
                ? lastIndexWithData
                : acc.lastIndex,
        };
    }, {} as Record<string, number | undefined>);

    if (firstIndex === undefined || lastIndex === undefined) {
        return options;
    }

    const xAxisfiltered = Array.isArray(options.xAxis)
        ? options.xAxis.map(xAxis => {
              return { ...xAxis, categories: categories.slice(firstIndex, lastIndex + 1) };
          })
        : { ...options.xAxis, categories: categories.slice(firstIndex, lastIndex + 1) };

    const filteredSeries = (options.series as Array<Highcharts.SeriesLineOptions>)?.map(serie => {
        return { ...serie, data: (serie.data || []).slice(firstIndex, lastIndex + 1) };
    });

    return { ...options, xAxis: xAxisfiltered, series: filteredSeries };
}
