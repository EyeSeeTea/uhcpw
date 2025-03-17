import { DATA_TAB_NAME } from "../../repositories/indicator-explorer/AnalyticsD2Repository";
import { Tab, TabsWithStringOrNumbers } from "../exportToCSV";

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

    const dataByQuintile = SORTED_QUINTILES.reduce(
        (acc: TabsWithStringOrNumbers["data"], quintile): TabsWithStringOrNumbers["data"] => {
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
        },
        []
    );

    const data = [[chartName], ...headersBase, ...dataByQuintile];
    const sortedData = sortDataByPoorest(data);

    const chartTab = {
        name: DATA_TAB_NAME,
        data: sortedData,
    };

    const tabsWithoutData = tabs.filter(tab => tab.name !== DATA_TAB_NAME);

    return [...tabsWithoutData, chartTab];
};

function sortDataByPoorest(data: TabsWithStringOrNumbers["data"]): TabsWithStringOrNumbers["data"] {
    const [chartName, headers, ...rows] = data;
    const poorestRow = rows.find(row => row[0] === "Poorest");

    if (!poorestRow || !headers || !chartName) {
        throw new Error("Missing poorest row or headers");
    }

    const sortedIndices = poorestRow
        .map((value, index) => ({ value: typeof value === "number" ? value : 0, index })) // Asegurar que es número
        .sort((a, b) => a.value - b.value)
        .map(item => item.index);

    const sortedHeaders = [...sortedIndices.map(i => headers[i]).map(value => (!value ? null : value))];

    const sortedRows = rows.map(row => [...sortedIndices.map(i => row[i]).map(value => (!value ? null : value))]);

    return [chartName, sortedHeaders, ...sortedRows];
}
