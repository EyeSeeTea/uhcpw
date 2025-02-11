import { DATA_TAB_NAME, CHART_TAB_NAME } from "../repositories/indicator-explorer/AnalyticsD2Repository";
import { Tab, TabsWithStringOrNumbers } from "./exportToCSV";

const SORTED_QUINTILES = ["Poorest", "2nd", "3rd", "4th", "Richest"];

export const chart_GimM6ANOKhd_exportedDataBuilder: (tabs: Tab[], chartName: string) => TabsWithStringOrNumbers[] = (
    tabs,
    chartName
) => {
    const dataTab = tabs.find(tab => tab.name === DATA_TAB_NAME);

    if (!dataTab) {
        throw new Error("Data tab not found");
    }

    const headers = dataTab.data[1];

    const countryIndex = headers?.indexOf("Country");
    const quintileIndex = headers?.indexOf("Quintile");
    const yearIndex = headers?.indexOf("Year");
    const valueIndex = headers?.indexOf("Value");

    if (
        countryIndex === undefined ||
        countryIndex === -1 ||
        quintileIndex === undefined ||
        quintileIndex === -1 ||
        yearIndex === undefined ||
        yearIndex === -1 ||
        valueIndex === undefined ||
        valueIndex === -1
    ) {
        throw new Error("Missing required columns in the data tab");
    }

    const allCountriesAndYears = dataTab.data
        .slice(2)
        .map(row => (row[countryIndex] && row[yearIndex] ? `${row[countryIndex]}-${row[yearIndex]}` : undefined))
        .filter((countryAndYear): countryAndYear is string => countryAndYear !== undefined);

    const countriesAndYearsUnique = [...new Set(allCountriesAndYears)];

    const headersBase = [["Quintile / Country - Year", ...countriesAndYearsUnique]];

    const data = SORTED_QUINTILES.reduce((acc: (string | number)[][], quintile): (string | number)[][] => {
        const quintileData = countriesAndYearsUnique.map(countryAndYear => {
            const [country, year] = countryAndYear.split("-");
            const row = dataTab.data.find(
                row => row[quintileIndex] === quintile && row[yearIndex] === year && row[countryIndex] === country
            );
            const value = row ? row[valueIndex] : undefined;

            if (!row || !value) {
                return 0;
            }

            return Number(value?.replace(",", "."));
        });

        return [...acc, [quintile, ...quintileData]];
    }, []);

    const chartTab = {
        name: CHART_TAB_NAME,
        data: [[chartName], ...headersBase, ...data],
    };

    return [...tabs, chartTab];
};
