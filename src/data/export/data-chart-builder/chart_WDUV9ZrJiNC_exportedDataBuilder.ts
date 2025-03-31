import { DATA_TAB_NAME } from "../../repositories/indicator-explorer/AnalyticsD2Repository";
import { Tab, TabsWithStringOrNumbers } from "../exportToCSV";

const SORTED_PARAMETERS = ["All households", "Poorest consumption quintile"];

export const chart_WDUV9ZrJiNC_exportedDataBuilder: (tabs: Tab[], chartName: string) => TabsWithStringOrNumbers[] = (
    tabs,
    chartName
) => {
    const dataTab = tabs.find(tab => tab.name === DATA_TAB_NAME);
    if (!dataTab) {
        throw new Error("Data tab not found");
    }

    const headers = dataTab.data[1];
    const countryIndex = headers?.indexOf("Country");
    const parameterIndex = headers?.indexOf("Parameter");
    const yearIndex = headers?.indexOf("Year");
    const valueIndex = headers?.indexOf("Value");
    if (
        countryIndex === undefined ||
        countryIndex === -1 ||
        parameterIndex === undefined ||
        parameterIndex === -1 ||
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

    const headersBase = [["Parameters / Country - Year", ...countriesAndYearsUnique]];

    const dataByParameter = SORTED_PARAMETERS.reduce(
        (acc: TabsWithStringOrNumbers["data"], parameter): TabsWithStringOrNumbers["data"] => {
            const parameterData = countriesAndYearsUnique.map(countryAndYear => {
                const [country, year] = countryAndYear.split("-");
                const row = dataTab.data.find(
                    row => row[parameterIndex] === parameter && row[yearIndex] === year && row[countryIndex] === country
                );
                const value = row ? row[valueIndex] : undefined;
                if (!row || !value) {
                    return 0;
                }
                return Number(value?.replace(",", "."));
            });
            return [...acc, [parameter, ...parameterData]];
        },
        []
    );

    const data = [[chartName], ...headersBase, ...dataByParameter];
    const sortedData = sortDataByAllHouseholds(data);

    const chartTab = {
        name: DATA_TAB_NAME,
        data: sortedData,
    };

    const tabsWithoutData = tabs.filter(tab => tab.name !== DATA_TAB_NAME);

    return [...tabsWithoutData, chartTab];
};

function sortDataByAllHouseholds(data: TabsWithStringOrNumbers["data"]): TabsWithStringOrNumbers["data"] {
    const [chartName, headers, ...rows] = data;
    const allHouseholdsRow = rows.find(row => row[0] === "All households");

    if (!allHouseholdsRow || !headers || !chartName) {
        throw new Error("Missing All households row or headers");
    }

    const sortedIndices = allHouseholdsRow
        .map((value, index) => ({ value: typeof value === "number" ? value : 0, index }))
        .sort((a, b) => a.value - b.value)
        .map(item => item.index);

    const sortedHeaders = [...sortedIndices.map(i => headers[i]).map(value => (!value ? null : value))];

    const sortedRows = rows.map(row => [...sortedIndices.map(i => row[i]).map(value => (!value ? null : value))]);

    return [chartName, sortedHeaders, ...sortedRows];
}
