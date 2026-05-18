import { mapFromWhoCountryNameToId, mapToWhoCountryCode } from "../../repositories/countries/mapToWhoCountryData";
import { DATA_TAB_NAME, D2OrgUnit } from "../../repositories/indicator-explorer/AnalyticsD2Repository";
import { insertArrayAt } from "../../repositories/indicator-explorer/utils/insertArrayAt";
import {
    COUNTRY_AREA_COLUMN,
    VALUE_COLUMN,
    YEAR_COLUMN,
} from "../../repositories/indicator-explorer/utils/sortColumnsAndDataRows";
import { Tab, TabsWithStringOrNumbers } from "../exportToCSV";

const COUNTRY_YEAR_SEPARATOR = "-";

export function getTabsWithChartData(
    tabs: Tab[],
    options: {
        chartName: string;
        headerDataParamName: string;
        headersBase: string[];
        sortedDataParams: string[];
        dataParamToSortBy?: string;
        isCountryChart?: boolean;
        isSortByDataSum?: boolean;
        hasCountryCodeRow?: boolean;
        orgUnits?: D2OrgUnit[];
        countriesAndYearsUniqueParam?: (string | null)[];
    }
): TabsWithStringOrNumbers[] {
    const {
        chartName,
        headerDataParamName,
        headersBase,
        sortedDataParams,
        dataParamToSortBy,
        orgUnits,
        isCountryChart = false,
        isSortByDataSum = false,
        hasCountryCodeRow = false,
        countriesAndYearsUniqueParam,
    } = options;

    const dataTab = tabs.find(tab => tab.name === DATA_TAB_NAME);
    if (!dataTab) {
        throw new Error("Data tab not found");
    }

    const headers = dataTab.data[1];
    const countryIndex = headers?.indexOf(COUNTRY_AREA_COLUMN);
    const dataParamIndex = headers?.indexOf(headerDataParamName);
    const yearIndex = headers?.indexOf(YEAR_COLUMN);
    const valueIndex = headers?.indexOf(VALUE_COLUMN);
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

    const countriesAndYearsUnique = isCountryChart
        ? []
        : countriesAndYearsUniqueParam ?? getCountriesAndYearsUnique(dataTab.data, countryIndex, yearIndex);

    const allYears = isCountryChart
        ? dataTab.data
              .slice(2)
              .map(row => row[yearIndex])
              .filter((year): year is string => year !== undefined)
        : [];

    const allYearsUnique = isCountryChart
        ? [...new Set(allYears)].map(year => Number(year)).sort((yearA, yearB) => yearA - yearB)
        : [];

    const dataByDataParam: TabsWithStringOrNumbers["data"] = getDataSortedByDataParam({
        dataTab: dataTab,
        sortedDataParams: sortedDataParams,
        isCountryChart: isCountryChart,
        allYearsUnique: allYearsUnique,
        countriesAndYearsUnique: countriesAndYearsUnique,
        dataParamIndex: dataParamIndex,
        yearIndex: yearIndex,
        countryIndex: countryIndex,
        valueIndex: valueIndex,
    });

    const countryInsertIndex = Math.max(headersBase.indexOf(COUNTRY_AREA_COLUMN), 0);
    const dataByDataParamWithCountry =
        isCountryChart && country
            ? dataByDataParam.map(row => insertArrayAt(row, countryInsertIndex, country))
            : dataByDataParam;

    const countriesAndYearsUniqueHeader = countriesAndYearsUnique.map(countryAndYear => {
        if (!countryAndYear) return null;

        const [countryName, year] = countryAndYear.split(COUNTRY_YEAR_SEPARATOR);
        return `${countryName} ${year}`;
    });

    const restHeaders = isCountryChart ? allYearsUnique : countriesAndYearsUniqueHeader;

    const finalHeaders = [[...headersBase, ...restHeaders]];

    const data =
        hasCountryCodeRow && orgUnits
            ? getDataWithCountryCodesRow({
                  headersBase: headersBase,
                  countriesAndYearsUnique: countriesAndYearsUnique,
                  orgUnits: orgUnits,
                  finalHeaders: finalHeaders,
                  dataByDataParamWithCountry: dataByDataParamWithCountry,
              })
            : [...finalHeaders, ...dataByDataParamWithCountry];

    const sortedData =
        dataParamToSortBy || isSortByDataSum
            ? sortData(data, {
                  dataParamToSortBy: dataParamToSortBy,
                  isSortByDataSum: isSortByDataSum,
                  hasCountryCodeRow: hasCountryCodeRow,
              })
            : data;

    return tabs.map((tab): TabsWithStringOrNumbers => {
        if (tab.name === DATA_TAB_NAME) {
            return {
                name: DATA_TAB_NAME,
                data: [[chartName], ...sortedData],
            };
        }
        return tab;
    });
}

function getDataSortedByDataParam(params: {
    dataTab: Tab;
    sortedDataParams: string[];
    isCountryChart: boolean;
    allYearsUnique: number[];
    countriesAndYearsUnique: (string | null)[];
    dataParamIndex: number;
    yearIndex: number;
    countryIndex: number;
    valueIndex: number;
}): TabsWithStringOrNumbers["data"] {
    const {
        dataTab,
        sortedDataParams,
        isCountryChart,
        allYearsUnique,
        countriesAndYearsUnique,
        dataParamIndex,
        yearIndex,
        countryIndex,
        valueIndex,
    } = params;
    return sortedDataParams.reduce((acc: TabsWithStringOrNumbers["data"], param): TabsWithStringOrNumbers["data"] => {
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
                if (!countryAndYear) return null;

                const [country, year] = countryAndYear.split(COUNTRY_YEAR_SEPARATOR);
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
    }, []);
}

function getDataWithCountryCodesRow(params: {
    headersBase: string[];
    countriesAndYearsUnique: (string | null)[];
    orgUnits: D2OrgUnit[];
    finalHeaders: (string | number | null)[][];
    dataByDataParamWithCountry: (string | number | null)[][];
}) {
    const { headersBase, countriesAndYearsUnique, orgUnits, finalHeaders, dataByDataParamWithCountry } = params;
    return [
        ...finalHeaders,
        [...headersBase, ...getCountryCodesRow(countriesAndYearsUnique, orgUnits)],
        ...dataByDataParamWithCountry,
    ];
}

function getCountryCodesRow(countriesAndYearsHeaders: (string | null)[], orgUnits: D2OrgUnit[]): (string | null)[] {
    return countriesAndYearsHeaders.map(countryAndYear => {
        if (!countryAndYear) return null;

        const [country, year] = countryAndYear.split(COUNTRY_YEAR_SEPARATOR);
        const countryName = country || "";
        const orgUnitCode =
            orgUnits.find(
                orgUnit => orgUnit.shortName === countryName || orgUnit.id === mapFromWhoCountryNameToId(countryName)
            )?.code || countryName;
        return `${mapToWhoCountryCode(orgUnitCode)} ${year}`;
    });
}

function sortData(
    data: TabsWithStringOrNumbers["data"],
    options: {
        dataParamToSortBy?: string;
        isSortByDataSum: boolean;
        hasCountryCodeRow: boolean;
    }
): TabsWithStringOrNumbers["data"] {
    const { dataParamToSortBy, isSortByDataSum, hasCountryCodeRow } = options;
    const { headers, countryCodesRow: maybeCountryCodesRow, dataRows } = extractHeadersAndRows(data, hasCountryCodeRow);

    if (dataParamToSortBy) {
        return sortDataByDataParam(dataParamToSortBy, dataRows, headers, maybeCountryCodesRow);
    } else if (isSortByDataSum) {
        return sortDataByDataSum(dataRows, headers, maybeCountryCodesRow);
    } else {
        return data;
    }
}

function extractHeadersAndRows(
    data: TabsWithStringOrNumbers["data"],
    hasCountryCodeRow: boolean
): {
    headers: (string | number | null)[];
    countryCodesRow?: (string | number | null)[];
    dataRows: TabsWithStringOrNumbers["data"];
} {
    if (hasCountryCodeRow) {
        const [headers, countryCodesRow, ...dataRows] = data;
        if (!countryCodesRow || !headers) {
            throw new Error("Missing country codes row or headers in the data");
        }
        return { headers, countryCodesRow, dataRows };
    } else {
        const [headers, ...dataRows] = data;
        if (!headers) {
            throw new Error("Missing headers in the data");
        }
        return { headers, dataRows };
    }
}

function sortDataByDataSum(
    dataRows: TabsWithStringOrNumbers["data"],
    headers: (string | number | null)[],
    countryCodesRow?: (string | number | null)[]
): TabsWithStringOrNumbers["data"] {
    const indexedColumns = headers.map((_, colIndex) => ({
        index: colIndex,
        sum:
            colIndex === 0
                ? -Infinity
                : dataRows.reduce((sum, row) => {
                      const rowValue = row[colIndex];
                      return sum + (typeof rowValue === "number" ? rowValue : 0);
                  }, 0),
        header: headers[colIndex],
    }));

    const sortedIndexes = indexedColumns.sort((a, b) => a.sum - b.sum).map(({ index }) => index);

    const sortedData = sortByIndexes({
        headers: headers,
        countryCodesRow: countryCodesRow,
        dataRows: dataRows,
        sortedIndexes: sortedIndexes,
    });

    return [...sortedData];
}

function sortDataByDataParam(
    dataParamToSortBy: string,
    dataRows: TabsWithStringOrNumbers["data"],
    headers: (string | number | null)[],
    countryCodesRow?: (string | number | null)[]
): TabsWithStringOrNumbers["data"] {
    const rowToSortBy = dataRows.find(row => row[0] === dataParamToSortBy);

    if (!rowToSortBy) {
        throw new Error(`Missing ${dataParamToSortBy} row`);
    }

    const sortedIndexes = rowToSortBy
        .map((value, index) => ({ value: typeof value === "number" ? value : 0, index }))
        .sort((a, b) => a.value - b.value)
        .map(item => item.index);

    const sortedData = sortByIndexes({
        headers: headers,
        countryCodesRow: countryCodesRow,
        dataRows: dataRows,
        sortedIndexes: sortedIndexes,
    });

    return [...sortedData];
}

function sortByIndexes(params: {
    headers: (string | number | null)[];
    countryCodesRow?: (string | number | null)[];
    dataRows: TabsWithStringOrNumbers["data"];
    sortedIndexes: number[];
}): TabsWithStringOrNumbers["data"] {
    const { headers, dataRows, sortedIndexes, countryCodesRow } = params;

    const sortedHeaders = sortedIndexes.map(i => headers[i] ?? null);

    const sortedCountryCodesRow = countryCodesRow ? sortedIndexes.map(i => countryCodesRow[i] ?? null) : undefined;

    const sortedRows = dataRows.map(row => sortedIndexes.map(i => row[i] ?? 0));

    return sortedCountryCodesRow
        ? [sortedHeaders, sortedCountryCodesRow, ...sortedRows]
        : [sortedHeaders, ...sortedRows];
}

function getCountriesAndYearsUnique(data: Array<string[]>, countryIndex: number, yearIndex: number): Array<string> {
    const allCountriesAndYears = data
        .slice(2)
        .map(row =>
            row[countryIndex] && row[yearIndex]
                ? `${row[countryIndex]}${COUNTRY_YEAR_SEPARATOR}${row[yearIndex]}`
                : undefined
        )
        .filter((countryAndYear): countryAndYear is string => countryAndYear !== undefined);

    return [...new Set(allCountriesAndYears)];
}
