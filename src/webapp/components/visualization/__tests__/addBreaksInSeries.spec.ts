import "@testing-library/jest-dom";
import Highcharts from "highcharts";

import chartStackedColumnOptionsJson from "./data/chartStackedColumnOptions.json";
import chartLineOptionsJson from "./data/chartLineOptions.json";
import chartCountriesLineOptionsJson from "./data/chartCountriesLineOptions.json";
import chartStackedColumnABreakBeforeFirstOptionsJson from "./data/chartStackedColumnABreakBeforeFirstOptions.json";
import chartLineOneValueBeforeBreakOptionsWithBreaksOptionsJson from "./data/chartLineOneValueBeforeBreakOptionsWithBreaksOptionsJson.json";
import { chartStackedColumnOptionsWithBreaks } from "./data/chartStackedColumnOptionsWithBreaks";
import { chartLineOptionsWithBreaks } from "./data/chartLineOptionsWithBreaks";
import { chartCountriesLineOptionsWithBreaks } from "./data/chartCountriesLineOptionsWithBreaks";
import { chartStackedColumnABreakBeforeFirstOptionsWithBreaks } from "./data/chartStackedColumnABreakBeforeFirstOptionsWithBreaks";
import { chartLineOneValueBeforeBreakOptionsWithBreaks } from "./data/chartLineOneValueBeforeBreakOptionsWithBreaks";
import countriesJson from "./data/countries.json";
import countryJson from "./data/country.json";
import {
    BreakInSeries,
    VisualizationBreakInSeries,
} from "../../../../domain/entities/indicator-explorer/BreakInSeries";
import { Country } from "../../../../domain/entities/Country";
import { addBreaksInSeries } from "../addBreaksInSeries";

type TestTypeValue =
    | "stackedColumn"
    | "line"
    | "countriesLine"
    | "stackedColumnABreakBeforeFirst"
    | "lineOneValueBeforeBreak";

describe("Given addBreakInSeries", () => {
    describe("When we have a stacked column chart with a break in series", () => {
        it("Then should add null values in data and empty strings in categories as breaks according with breaks configuration", () => {
            const chartOptions = givenChartOptions("stackedColumn");
            const visualizationBreakInSeries = givenVisualizationBreakInSeries();
            const countries = givenACountry();

            const chartOptionsWithBreaks = addBreaksInSeries(
                chartOptions,
                visualizationBreakInSeries,
                countries,
                false
            );

            const expectedChartOptionsWithBreaks = givenChartOptionsWithBreaks("stackedColumn");

            verifyChartOptions(chartOptionsWithBreaks, expectedChartOptionsWithBreaks);
        });
    });

    describe("When we have a line chart with a break in series", () => {
        it("Then should slice the series in others and adding transparent series in between to simulate the breaks according with breaks configuration", () => {
            const chartOptions = givenChartOptions("line");
            const visualizationBreakInSeries = givenVisualizationBreakInSeries();
            const countries = givenACountry();

            const chartOptionsWithBreaks = addBreaksInSeries(
                chartOptions,
                visualizationBreakInSeries,
                countries,
                false
            );

            const expectedChartOptionsWithBreaks = givenChartOptionsWithBreaks("line");

            verifyChartOptions(chartOptionsWithBreaks, expectedChartOptionsWithBreaks);
        });
    });

    describe("When we have a country series line chart with a break in series just in one country", () => {
        it("Then should slice just the series of the country than has breaks in others and adding transparent series in between to simulate the breaks according with breaks configuration", () => {
            const chartOptions = givenChartOptions("countriesLine");
            const visualizationBreakInSeries = givenVisualizationBreakInSeries();
            const countries = givenCountries();

            const chartOptionsWithBreaks = addBreaksInSeries(chartOptions, visualizationBreakInSeries, countries, true);

            const expectedChartOptionsWithBreaks = givenChartOptionsWithBreaks("countriesLine");

            verifyChartOptions(chartOptionsWithBreaks, expectedChartOptionsWithBreaks);
        });
    });

    describe("When we have a stacked column chart with a break in series but this break is before the first position of the chart", () => {
        it("Then should not add any break", () => {
            const chartOptions = givenChartOptions("stackedColumnABreakBeforeFirst");
            const visualizationBreakInSeries = givenVisualizationBreakInSeries();
            const countries = givenCountries();

            const chartOptionsWithBreaks = addBreaksInSeries(chartOptions, visualizationBreakInSeries, countries, true);

            const expectedChartOptionsWithBreaks = givenChartOptionsWithBreaks("stackedColumnABreakBeforeFirst");

            verifyChartOptions(chartOptionsWithBreaks, expectedChartOptionsWithBreaks);
        });
    });

    describe("When we have a line chart with a break in series before selected year and we select just this year", () => {
        it("Then should not add any break", () => {
            const chartOptions = givenChartOptions("lineOneValueBeforeBreak");
            const visualizationBreakInSeries = givenVisualizationBreakInSeries();
            const countries = givenCountries();

            const chartOptionsWithBreaks = addBreaksInSeries(chartOptions, visualizationBreakInSeries, countries, true);

            const expectedChartOptionsWithBreaks = givenChartOptionsWithBreaks("lineOneValueBeforeBreak");

            verifyChartOptions(chartOptionsWithBreaks, expectedChartOptionsWithBreaks);
        });
    });
});

function givenChartOptions(type: TestTypeValue): Highcharts.Options {
    const chartOptionsTypes = {
        stackedColumn: chartStackedColumnOptionsJson as unknown as Highcharts.Options,
        stackedColumnABreakBeforeFirst: chartStackedColumnABreakBeforeFirstOptionsJson as unknown as Highcharts.Options,
        line: chartLineOptionsJson as unknown as Highcharts.Options,
        countriesLine: chartCountriesLineOptionsJson as unknown as Highcharts.Options,
        lineOneValueBeforeBreak:
            chartLineOneValueBeforeBreakOptionsWithBreaksOptionsJson as unknown as Highcharts.Options,
    } as Record<TestTypeValue, Highcharts.Options>;

    const chartOptions = chartOptionsTypes[type];

    return chartOptions as Highcharts.Options;
}

function givenVisualizationBreakInSeries(): VisualizationBreakInSeries {
    const breakInSeries = new BreakInSeries();
    breakInSeries.addVisualization("jFtGKQIQTGp");
    breakInSeries.addCountry("jFtGKQIQTGp", "DVnpk4xiXGJ", {
        years: ["2015", "2018"],
        description:
            "During 2015 and 2018 there were some changes that affected how this is measured.\n\nTherefore, we are applying break in series.",
    });

    return breakInSeries.getVisualization("jFtGKQIQTGp") as VisualizationBreakInSeries;
}

function givenACountry(): Country[] {
    return countryJson as Country[];
}

function givenCountries(): Country[] {
    return countriesJson as Country[];
}

function givenChartOptionsWithBreaks(type: TestTypeValue): Highcharts.Options {
    const chartOptionsTypes = {
        stackedColumn: chartStackedColumnOptionsWithBreaks,
        stackedColumnABreakBeforeFirst: chartStackedColumnABreakBeforeFirstOptionsWithBreaks,
        line: chartLineOptionsWithBreaks,
        countriesLine: chartCountriesLineOptionsWithBreaks,
        lineOneValueBeforeBreak: chartLineOneValueBeforeBreakOptionsWithBreaks,
    } as Record<TestTypeValue, Highcharts.Options>;

    const chartOptions = chartOptionsTypes[type];

    return chartOptions as Highcharts.Options;
}

function verifyChartOptions(chartOptions: Highcharts.Options, expectedChartOptions: Highcharts.Options): void {
    expect(chartOptions.xAxis).toEqual(expectedChartOptions.xAxis);
    expect(chartOptions.series).toEqual(expectedChartOptions.series);
    expect(chartOptions.plotOptions).toEqual(expectedChartOptions.plotOptions);
}
