import { DATA_TAB_NAME } from "../../repositories/indicator-explorer/AnalyticsD2Repository";
import { Tab, TabsWithStringOrNumbers } from "../exportToCSV";

export function getTabsWithChartData(
    tabs: Tab[],
    options: {
        chartName: string;
        headerDataParamName: string;
        headersBase: string[];
        sortedDataParams: string[];
        dataParamToSortBy?: string;
        isCountryChart?: boolean;
    }
): TabsWithStringOrNumbers[] {
    const {
        chartName,
        headerDataParamName,
        headersBase,
        sortedDataParams,
        dataParamToSortBy,
        isCountryChart = false,
    } = options;

    const dataTab = tabs.find(tab => tab.name === DATA_TAB_NAME);
    if (!dataTab) {
        throw new Error("Data tab not found");
    }

    const headers = dataTab.data[1];
    const countryIndex = headers?.indexOf("Country");
    const dataParamIndex = headers?.indexOf(headerDataParamName);
    const yearIndex = headers?.indexOf("Year");
    const valueIndex = headers?.indexOf("Value");
    if (
        countryIndex === undefined ||
        countryIndex === -1 ||
        dataParamIndex === undefined ||
        dataParamIndex === -1 ||
        yearIndex === undefined ||
        yearIndex === -1 ||
        valueIndex === undefined ||
        valueIndex === -1
    ) {
        throw new Error("Missing required columns in the data tab");
    }

    const country = dataTab.data[2] && isCountryChart ? dataTab.data[2][countryIndex] : "";
    if (isCountryChart && !country) {
        throw new Error("Missing country in the data tab");
    }

    const allCountriesAndYears = isCountryChart
        ? []
        : dataTab.data
              .slice(2)
              .map(row => (row[countryIndex] && row[yearIndex] ? `${row[countryIndex]}-${row[yearIndex]}` : undefined))
              .filter((countryAndYear): countryAndYear is string => countryAndYear !== undefined);

    const countriesAndYearsUnique = isCountryChart ? [] : [...new Set(allCountriesAndYears)];

    const allYears = isCountryChart
        ? dataTab.data
              .slice(2)
              .map(row => row[yearIndex])
              .filter((year): year is string => year !== undefined)
        : [];

    const allYearsUnique = isCountryChart ? [...new Set(allYears)].map(year => Number(year)) : [];

    const restHeaders = isCountryChart ? allYearsUnique : countriesAndYearsUnique;

    const finalHeaders = [[...headersBase, ...restHeaders]];

    const dataByDataParam: TabsWithStringOrNumbers["data"] = sortedDataParams.reduce(
        (acc: TabsWithStringOrNumbers["data"], param): TabsWithStringOrNumbers["data"] => {
            if (isCountryChart) {
                const paramData = allYearsUnique.map(year => {
                    const row = dataTab.data.find(
                        row => row[dataParamIndex] === param && row[yearIndex] === year.toString()
                    );
                    const value = row ? row[valueIndex] : undefined;
                    if (!row || !value) {
                        return 0;
                    }
                    return Number(value?.replace(",", "."));
                });
                return [...acc, [param, ...paramData]];
            } else {
                const paramData = countriesAndYearsUnique.map(countryAndYear => {
                    const [country, year] = countryAndYear.split("-");
                    const row = dataTab.data.find(
                        row => row[dataParamIndex] === param && row[yearIndex] === year && row[countryIndex] === country
                    );
                    const value = row ? row[valueIndex] : undefined;
                    if (!row || !value) {
                        return 0;
                    }
                    return Number(value?.replace(",", "."));
                });
                return [...acc, [param, ...paramData]];
            }
        },
        []
    );

    const dataByDataParamWithCountry =
        isCountryChart && country ? dataByDataParam.map(row => [country, ...row]) : dataByDataParam;

    const data = [[chartName], ...finalHeaders, ...dataByDataParamWithCountry];
    const sortedData = dataParamToSortBy ? sortDataByDataParam(dataParamToSortBy, data) : data;

    const chartTab = {
        name: DATA_TAB_NAME,
        data: sortedData,
    };

    const tabsWithoutData = tabs.filter(tab => tab.name !== DATA_TAB_NAME);

    return [...tabsWithoutData, chartTab];
}

function sortDataByDataParam(
    dataParamToSortBy: string,
    data: TabsWithStringOrNumbers["data"]
): TabsWithStringOrNumbers["data"] {
    const [chartName, headers, ...rows] = data;
    const poorestRow = rows.find(row => row[0] === dataParamToSortBy);

    if (!poorestRow || !headers || !chartName) {
        throw new Error(`Missing ${dataParamToSortBy} row or headers`);
    }

    const sortedIndices = poorestRow
        .map((value, index) => ({ value: typeof value === "number" ? value : 0, index })) // Asegurar que es número
        .sort((a, b) => a.value - b.value)
        .map(item => item.index);

    const sortedHeaders = [...sortedIndices.map(i => headers[i]).map(value => (!value ? null : value))];

    const sortedRows = rows.map(row => [...sortedIndices.map(i => row[i]).map(value => (!value ? null : value))]);

    return [chartName, sortedHeaders, ...sortedRows];
}
