import { DATA_TAB_NAME, D2OrgUnit } from "../../repositories/indicator-explorer/AnalyticsD2Repository";
import {
    COUNTRY_AREA_COLUMN,
    COUNTRY_YEAR_COLUMN,
    VALUE_COLUMN,
    YEAR_COLUMN,
} from "../../repositories/indicator-explorer/utils/sortColumnsAndDataRows";
import { Tab, TabsWithStringOrNumbers } from "../exportToCSV";

const HEADERS_BASE = [COUNTRY_YEAR_COLUMN];

export const chart_c5Cx8pOI9aj_exportedDataBuilder: (
    tabs: Tab[],
    chartName: string,
    orgUnits: D2OrgUnit[]
) => TabsWithStringOrNumbers[] = (tabs, chartName) => {
    const dataTab = tabs.find(tab => tab.name === DATA_TAB_NAME);
    if (!dataTab) throw new Error("Data tab not found");

    const headers = dataTab.data[1];
    const countryIndex = headers?.indexOf(COUNTRY_AREA_COLUMN);
    const yearIndex = headers?.indexOf(YEAR_COLUMN);
    const valueIndex = headers?.indexOf(VALUE_COLUMN);

    if (
        countryIndex === undefined ||
        countryIndex === -1 ||
        yearIndex === undefined ||
        yearIndex === -1 ||
        valueIndex === undefined ||
        valueIndex === -1
    ) {
        throw new Error("Missing required columns in the data tab");
    }

    const dataRows = dataTab.data.slice(2);

    const allYears = [
        ...new Set(dataRows.map(row => row[yearIndex]).filter((y): y is string => Boolean(y))),
    ].sort();

    const allCountries = [
        ...new Set(
            dataRows.map(row => row[countryIndex]).filter((c): c is string => c !== undefined)
        ),
    ].sort();

    const headerRow = [...HEADERS_BASE, ...allYears];

    const countryDataRows = allCountries.map(country => {
        const valuesPerYear = allYears.map(year => {
            const row = dataRows.find(r => r[yearIndex] === year && r[countryIndex] === country);
            const raw = row?.[valueIndex];
            if (!raw) return null;
            return Number(raw.replace(",", "."));
        });
        return [country, ...valuesPerYear];
    });

    const data: TabsWithStringOrNumbers["data"] = [[chartName], headerRow, ...countryDataRows];

    return tabs.map((tab): TabsWithStringOrNumbers => {
        if (tab.name === DATA_TAB_NAME) {
            return { name: DATA_TAB_NAME, data };
        }
        return tab;
    });
};
