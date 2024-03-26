import _ from "lodash";
import { ChartSource } from "./chartOptions";
import { comparativeStackedColumnChartOptions } from "./generic/comparativeStackedColumnChartOptions";

const seriesNames: Record<string, string> = {
    yKxOTGWUr4D: "Impoverished",
    MDhStd9lvOc: "Further impoverished",
};

const seriesColors: Record<string, string> = {
    yKxOTGWUr4D: "#e46c09",
    MDhStd9lvOc: "#c00000",
};

export function sortByFurtherImpoverished(chartOptions: Highcharts.Options): Highcharts.Options {
    const furtherImpoverishedSerie = chartOptions.series?.find(
        ({ id, type }) => id === "MDhStd9lvOc" && type === "column"
    );

    const furtherImpoverishedData =
        furtherImpoverishedSerie && furtherImpoverishedSerie.type === "column"
            ? (furtherImpoverishedSerie.data as Highcharts.PointOptionsObject[])
            : undefined;

    const sortedFurtherImpoverishedData = _.orderBy(furtherImpoverishedData, ["y"], ["asc"]);

    const sortedChartSeries = (chartOptions?.series || [])?.map(serie => {
        const currentData =
            serie && serie.type === "column" ? (serie.data as Highcharts.PointOptionsObject[]) : undefined;

        const data = sortedFurtherImpoverishedData?.map(({ name }) => {
            return currentData?.find(data => data.name === name);
        });
        return { ...serie, data };
    }) as Highcharts.Options["series"];

    return { ...chartOptions, series: sortedChartSeries };
}

export const chart_dbc87Ljw8uN_Options: (chartSource: ChartSource) => Highcharts.Options = chartSource => {
    const chartOptions = comparativeStackedColumnChartOptions(chartSource, seriesNames, seriesColors);
    return sortByFurtherImpoverished(chartOptions);
};
