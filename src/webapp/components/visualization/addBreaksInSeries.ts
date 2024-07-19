import Highcharts from "highcharts";

import { Country } from "../../../domain/entities/Country";
import {
    CountryBreakInSeries,
    VisualizationBreakInSeries,
} from "../../../domain/entities/indicator-explorer/BreakInSeries";
import { getCategories } from "./utils";
import { SerieCustomization } from "./customization/types";
import { Id } from "../../../domain/entities/Ref";

export function addBreaksInSeries(
    options: Highcharts.Options,
    visualizationBreakInSeries: VisualizationBreakInSeries,
    countries: Country[],
    isCountrySeries: boolean
): Highcharts.Options {
    if (!options.series || !options.xAxis) return options;

    const filteredVisualizationBreakInSeries = filterVisualizationBreakInSeriesByCountries(
        visualizationBreakInSeries,
        countries
    );

    const newXAxis =
        options.chart?.type === "column"
            ? getXAxisWithBreaks(filteredVisualizationBreakInSeries, options)
            : options.xAxis;

    const newSeries = getSeriesWithBreaks(
        options.chart?.type,
        options.series,
        filteredVisualizationBreakInSeries,
        getCategories(newXAxis),
        countries,
        isCountrySeries
    );

    return {
        ...options,
        xAxis: newXAxis,
        series: newSeries,
        plotOptions:
            options.chart?.type === "line"
                ? getPlotOptionsToToggleLegendItemsWithSameName(options)
                : options.plotOptions,
        chart:
            options.chart?.type === "line"
                ? addMouseOverOnLengendToHighlightSeriesWithSameName(options)
                : options.chart,
    };
}

function getPlotOptionsToToggleLegendItemsWithSameName(options: Highcharts.Options): Highcharts.PlotOptions {
    return {
        ...options.plotOptions,
        line: {
            ...options.plotOptions?.line,
            stickyTracking: false,
            events: {
                ...options.plotOptions?.line?.events,
                legendItemClick: function (
                    this: Highcharts.Series,
                    event: Highcharts.SeriesLegendItemClickEventObject
                ) {
                    this.chart.series.forEach(serie => {
                        if (serie.name === this.name) serie.setVisible(!serie.visible, true);
                    });
                    event.preventDefault();
                },
            },
            point: {
                ...options.plotOptions?.line?.point,
                events: {
                    ...options.plotOptions?.line?.point?.events,
                    mouseOver: function (this: Highcharts.Point) {
                        this.series.chart.series.forEach(serie => {
                            if (serie.name === this.series.name) {
                                serie.setState("hover");
                            } else {
                                serie.setState("inactive");
                            }
                        });
                    },
                },
            },
        },
    };
}

function addMouseOverOnLengendToHighlightSeriesWithSameName(options: Highcharts.Options): Highcharts.ChartOptions {
    return {
        ...options.chart,
        events: {
            ...options.chart?.events,
            load: function (this: Highcharts.Chart) {
                this.legend.allItems.forEach((item: any) => {
                    item.legendGroup.on("mouseover", function () {
                        item.chart.series.forEach((serie: Highcharts.Series) => {
                            if (serie.name === item.name) {
                                serie.setState("hover");
                            } else {
                                serie.setState("inactive");
                            }
                        });
                    });
                });
            },
        },
    };
}

function filterVisualizationBreakInSeriesByCountries(
    visualizationBreakInSeries: VisualizationBreakInSeries,
    countries: Country[]
): VisualizationBreakInSeries {
    const filteredCountries = countries.map(country => country.id);

    const filteredCountriesInBreakInSeries = new Map(
        Array.from(visualizationBreakInSeries.countries.entries()).filter(([countryId]) =>
            filteredCountries.includes(countryId)
        )
    );

    return {
        countries: filteredCountriesInBreakInSeries,
    };
}

function getUniqueAllYearsFromBreakInSeries(visualizationBreakInSeries: VisualizationBreakInSeries): string[] {
    const uniqueAllYearsFromBreakInSeries = Array.from(visualizationBreakInSeries.countries.values()).reduce(
        (acc: string[], country) => {
            return [...acc, ...country.years];
        },
        []
    );

    return [...new Set(uniqueAllYearsFromBreakInSeries)];
}

function getXAxisWithBreaks(
    visualizationBreakInSeries: VisualizationBreakInSeries,
    options: Highcharts.Options
): Highcharts.XAxisOptions | Highcharts.XAxisOptions[] {
    const uniqueAllYearsFromBreakInSeries = getUniqueAllYearsFromBreakInSeries(visualizationBreakInSeries);

    return Array.isArray(options.xAxis)
        ? options.xAxis?.map(axis => {
              return {
                  ...axis,
                  categories: getCategoriesWithBreaks(axis, uniqueAllYearsFromBreakInSeries),
              };
          })
        : {
              ...options.xAxis,
              categories: getCategoriesWithBreaks(options.xAxis, uniqueAllYearsFromBreakInSeries),
          };
}

function getCategoriesWithBreaks(xAxis: Highcharts.XAxisOptions | undefined, years: string[]): string[] | undefined {
    return xAxis?.categories?.reduce(
        (acc: string[], category, index) =>
            years.includes(category) && index !== 0 ? [...acc, "", category] : [...acc, category],
        []
    );
}

type SeriesLineOptionsWithCustomization = Highcharts.SeriesLineOptions & SerieCustomization;

function getSeriesWithBreaks(
    chartType: string | undefined,
    series: Array<Highcharts.SeriesOptionsType>,
    visualizationBreakInSeries: VisualizationBreakInSeries,
    categories: string[],
    countries: Country[],
    isCountrySeries: boolean
): Array<Highcharts.SeriesOptionsType> {
    switch (chartType) {
        case "line":
            return categories.length === 1
                ? series
                : getLineSeriesWithBreaks(
                      series as Array<SeriesLineOptionsWithCustomization>,
                      visualizationBreakInSeries,
                      categories,
                      countries,
                      isCountrySeries
                  );

        case "column":
            return getColumnSeriesWithBreaks(series as Array<Highcharts.SeriesColumnOptions>, categories);

        default:
            return series;
    }
}

/**
 * Generates column series with breaks by adding null simulating a break.
 */
function getColumnSeriesWithBreaks(
    series: Array<Highcharts.SeriesColumnOptions>,
    categories: string[]
): Array<Highcharts.SeriesColumnOptions> {
    return series?.map(serie => {
        const newData = categories.reduce(
            (acc: Array<number | null | Highcharts.PointOptionsObject>, category: string, index: number) => {
                const breaksInCategoriesUntilIndex = categories.slice(0, index).filter(item => item === "").length;
                const indexOfData = index - breaksInCategoriesUntilIndex;

                const data =
                    category === ""
                        ? [...acc, null]
                        : serie?.data && serie.data[indexOfData] !== undefined
                        ? [...acc, serie.data[indexOfData]]
                        : acc;

                return data as Array<number | null | Highcharts.PointOptionsObject>;
            },
            []
        );

        return {
            ...serie,
            data: newData,
        } as Highcharts.SeriesColumnOptions;
    });
}

/**
 *  Generates series of lines with breaks by slicing the series in others and adding transparent series in between to simulate the breaks.
 */
function getLineSeriesWithBreaks(
    series: Array<SeriesLineOptionsWithCustomization>,
    visualizationBreakInSeries: VisualizationBreakInSeries,
    categories: string[],
    countries: Country[],
    isCountrySeries: boolean
): Array<SeriesLineOptionsWithCustomization | Highcharts.SeriesLineOptions> {
    return series?.flatMap(serie => {
        const countryBreakInSeries = getCountryBreakInSeries(
            visualizationBreakInSeries,
            countries,
            serie.id,
            isCountrySeries
        );

        const breakYearsInCategories = countryBreakInSeries?.years.filter(year => categories.includes(year));

        if (!breakYearsInCategories?.length) return serie;

        const yearsBreakIndexes = breakYearsInCategories
            .flatMap((year: string) => categories.indexOf(year))
            .filter(index => index !== -1 && index !== 0);

        const allYearsBreakIndex = [0, ...yearsBreakIndexes, categories.length - 1];

        const splittedSeriesData = allYearsBreakIndex.reduce(
            (acc: Array<{ data: Array<number | null>; isBreakInSeries: boolean }>, yearBreakIndex, index) => {
                const nextYearBreakIndex = allYearsBreakIndex[index + 1];

                if (index + 1 <= allYearsBreakIndex.length && nextYearBreakIndex) {
                    const prevNulls = getNullArrayValues(0, yearBreakIndex);

                    const isLastIndex =
                        nextYearBreakIndex === categories.length - 1 &&
                        nextYearBreakIndex !== allYearsBreakIndex[index + 2];

                    const sliceData = serie.data?.slice(
                        yearBreakIndex,
                        isLastIndex ? categories.length : nextYearBreakIndex
                    );

                    const restNulls = getNullArrayValues(
                        [...prevNulls, ...(sliceData || [])].length,
                        categories.length
                    );

                    const notBreakData = {
                        data: [...prevNulls, ...(sliceData || []), ...restNulls] as Array<number | null>,
                        isBreakInSeries: false,
                    };

                    return yearsBreakIndexes.includes(yearBreakIndex)
                        ? [
                              ...acc,
                              {
                                  data: getBreakSeriesData(serie.data, yearBreakIndex, categories.length),
                                  isBreakInSeries: true,
                              },
                              notBreakData,
                          ]
                        : [...acc, notBreakData];
                }
                return acc;
            },
            [] as Array<{ data: Array<number | null>; isBreakInSeries: boolean }>
        );

        return splittedSeriesData.map((splittedSerie, index) => {
            if (splittedSerie.isBreakInSeries) {
                return {
                    data: splittedSerie.data,
                    color: "transparent",
                    name: serie.name,
                    showInLegend: false,
                } as Highcharts.SeriesLineOptions;
            }

            return {
                ...serie,
                data: splittedSerie.data,
                showInLegend: index === 0,
            };
        });
    });
}

function getBreakSeriesData(
    seriesData: SeriesLineOptionsWithCustomization["data"],
    yearBreakIndex: number,
    totalLength: number
): Array<number | null> {
    const prevNulls = getNullArrayValues(0, yearBreakIndex - 1);

    const sliceData = seriesData?.slice(yearBreakIndex - 1, yearBreakIndex + 1) as Array<number | null>;

    const restNulls = getNullArrayValues(prevNulls.length + 1, totalLength - 1);

    return [...prevNulls, ...(sliceData || []), ...restNulls];
}

function getNullArrayValues(startIndex: number, endIndex: number): null[] {
    return Array.from({ length: endIndex - startIndex }, () => null);
}

function getCountryBreakInSeries(
    visualizationBreakInSeries: VisualizationBreakInSeries,
    countries: Country[],
    countryId: Id | undefined,
    isCountrySeries: boolean
): CountryBreakInSeries | undefined {
    if (isCountrySeries && countryId) {
        return visualizationBreakInSeries.countries.get(countryId);
    }

    if (countries[0] && countries[0].id) {
        return visualizationBreakInSeries.countries.get(countries[0].id);
    }
}
