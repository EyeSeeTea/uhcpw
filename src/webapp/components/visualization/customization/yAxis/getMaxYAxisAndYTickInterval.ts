import { SeriesColumnOptions } from "highcharts";
import {
    getMaxAxisAndTickInterval,
    getMaxValuesInSeriesData,
    isNumberData,
    sumSeriesData,
} from "../../utils/getMaxAxisAndTickInterval";

export function getMaxYAxisAndYTickIntervalForStackedColumns(series: SeriesColumnOptions[] | undefined):
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
        return getMaxAxisAndTickInterval(sumOfSeriesData);
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
