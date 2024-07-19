import "@testing-library/jest-dom";
import Highcharts from "highcharts";

import chartStackedColumnOptionsJson from "./data/chartStackedColumnOptions.json";
import chartLineOptionsJson from "./data/chartLineOptions.json";
import chartCountriesLineOptionsJson from "./data/chartCountriesLineOptions.json";
import chartStackedColumnABreakBeforeFirstOptionsJson from "./data/chartStackedColumnABreakBeforeFirstOptions.json";
import chartLineOneValueBeforeBreakOptionsWithBreaksOptionsJson from "./data/chartLineOneValueBeforeBreakOptionsWithBreaksOptionsJson.json";
import chartLineABreakLastJson from "./data/chartLineABreakLast.json";
import chartStackedColumnABreakLastJson from "./data/chartStackedColumnABreakLast.json";
import chartStackedColumnNotBreakInCategoriesJson from "./data/chartStackedColumnNotBreakInCategories.json";
import chartLineNotBreakInCategoriesJson from "./data/chartLineNotBreakInCategories.json";
import { chartStackedColumnOptionsWithBreaks } from "./data/chartStackedColumnOptionsWithBreaks";
import { chartLineOptionsWithBreaks } from "./data/chartLineOptionsWithBreaks";
import { chartCountriesLineOptionsWithBreaks } from "./data/chartCountriesLineOptionsWithBreaks";
import { chartStackedColumnABreakBeforeFirstOptionsWithBreaks } from "./data/chartStackedColumnABreakBeforeFirstOptionsWithBreaks";
import { chartLineOneValueBeforeBreakOptionsWithBreaks } from "./data/chartLineOneValueBeforeBreakOptionsWithBreaks";
import { chartLineABreakLast } from "./data/chartLineABreakLast";
import { chartStackedColumnABreakLast } from "./data/chartStackedColumnABreakLast";
import { chartStackedColumnNotBreakInCategories } from "./data/chartStackedColumnNotBreakInCategories";
import { chartLineNotBreakInCategories } from "./data/chartLineNotBreakInCategories";
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
    | "lineOneValueBeforeBreak"
    | "stackedColumnABreakLast"
    | "lineABreakLast"
    | "stackedColumnNotBreakInCategories"
    | "lineNotBreakInCategories";

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

            const chartOptionsWithBreaks = addBreaksInSeries(
                chartOptions,
                visualizationBreakInSeries,
                countries,
                false
            );

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

    describe("When we have a stacked column chart with a break in series that is the last value in chart", () => {
        it("Then should add a break before", () => {
            const chartOptions = givenChartOptions("stackedColumnABreakLast");
            const visualizationBreakInSeries = givenVisualizationBreakInSeries();
            const countries = givenCountries();

            const chartOptionsWithBreaks = addBreaksInSeries(
                chartOptions,
                visualizationBreakInSeries,
                countries,
                false
            );

            const expectedChartOptionsWithBreaks = givenChartOptionsWithBreaks("stackedColumnABreakLast");

            verifyChartOptions(chartOptionsWithBreaks, expectedChartOptionsWithBreaks);
        });
    });

    describe("When we have a line chart with a break in series that is the last value in chart", () => {
        it("Then should add a break before", () => {
            const chartOptions = givenChartOptions("lineABreakLast");
            const visualizationBreakInSeries = givenVisualizationBreakInSeries();
            const countries = givenCountries();

            const chartOptionsWithBreaks = addBreaksInSeries(chartOptions, visualizationBreakInSeries, countries, true);

            const expectedChartOptionsWithBreaks = givenChartOptionsWithBreaks("lineABreakLast");

            verifyChartOptions(chartOptionsWithBreaks, expectedChartOptionsWithBreaks);
        });
    });

    describe("When we have a stacked column chart with a break in series but this break is not in the categories of the chart but there is a category before and after that break", () => {
        it("Then should add a break", () => {
            const chartOptions = givenChartOptions("stackedColumnNotBreakInCategories");
            const visualizationBreakInSeries = givenVisualizationBreakInSeries();
            const countries = givenCountries();

            const chartOptionsWithBreaks = addBreaksInSeries(
                chartOptions,
                visualizationBreakInSeries,
                countries,
                false
            );

            const expectedChartOptionsWithBreaks = givenChartOptionsWithBreaks("stackedColumnNotBreakInCategories");

            verifyChartOptions(chartOptionsWithBreaks, expectedChartOptionsWithBreaks);
        });
    });

    describe("When we have a line chart with a break in series but this break is not in the categories of the chart but there is a category before and after that break", () => {
        it("Then should add a break", () => {
            const chartOptions = givenChartOptions("lineNotBreakInCategories");
            const visualizationBreakInSeries = givenVisualizationBreakInSeries();
            const countries = givenCountries();

            const chartOptionsWithBreaks = addBreaksInSeries(chartOptions, visualizationBreakInSeries, countries, true);

            const expectedChartOptionsWithBreaks = givenChartOptionsWithBreaks("lineNotBreakInCategories");

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
        lineABreakLast: chartLineABreakLastJson as unknown as Highcharts.Options,
        stackedColumnABreakLast: chartStackedColumnABreakLastJson as unknown as Highcharts.Options,
        stackedColumnNotBreakInCategories: chartStackedColumnNotBreakInCategoriesJson as unknown as Highcharts.Options,
        lineNotBreakInCategories: chartLineNotBreakInCategoriesJson as unknown as Highcharts.Options,
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
        lineABreakLast: chartLineABreakLast,
        stackedColumnABreakLast: chartStackedColumnABreakLast,
        stackedColumnNotBreakInCategories: chartStackedColumnNotBreakInCategories,
        lineNotBreakInCategories: chartLineNotBreakInCategories,
    } as Record<TestTypeValue, Highcharts.Options>;

    const chartOptions = chartOptionsTypes[type];

    return chartOptions as Highcharts.Options;
}

function verifyChartOptions(chartOptions: Highcharts.Options, expectedChartOptions: Highcharts.Options): void {
    expect(chartOptions.xAxis).toEqual(expectedChartOptions.xAxis);
    expect(chartOptions.series).toEqual(expectedChartOptions.series);
    expect(chartOptions.plotOptions).toEqual(expectedChartOptions.plotOptions);
}
