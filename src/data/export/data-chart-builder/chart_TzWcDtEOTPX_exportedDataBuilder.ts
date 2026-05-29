import { DATA_TAB_NAME } from "../../repositories/indicator-explorer/AnalyticsD2Repository";
import {
    COUNTRY_AREA_COLUMN,
    INDICATOR_COLUMN,
} from "../../repositories/indicator-explorer/utils/sortColumnsAndDataRows";
import { Tab, TabsWithStringOrNumbers } from "../exportToCSV";
import { sumByKey, toPercentage, toSafeNumber } from "../utils";
import { getTabsWithChartData } from "./getTabsWithChartData";

const SORTED_PARAMETERS = [
    "Further impoverished",
    "Impoverished",
    "At risk of impoverishment",
    "Not at risk of impoverishment",
];
const HEADER_DATA_PARAM_NAME = INDICATOR_COLUMN;
const HEADERS_BASE = [COUNTRY_AREA_COLUMN, INDICATOR_COLUMN];

export const chart_TzWcDtEOTPX_exportedDataBuilder: (tabs: Tab[], chartName: string) => TabsWithStringOrNumbers[] = (
    tabs,
    chartName
) => {
    const tabsWithChartData = getTabsWithChartData(tabs, {
        chartName,
        headerDataParamName: HEADER_DATA_PARAM_NAME,
        headersBase: HEADERS_BASE,
        sortedDataParams: SORTED_PARAMETERS,
        isCountryChart: true,
    });

    const dataTab = tabsWithChartData.find(tab => tab.name === DATA_TAB_NAME);

    return tabs.map((tab): TabsWithStringOrNumbers => {
        if (tab.name === DATA_TAB_NAME && dataTab?.data) {
            return {
                name: DATA_TAB_NAME,
                data: appendNormalizedRows(dataTab.data),
            };
        }
        return tab;
    });
};

function appendNormalizedRows(data: (string | number | null)[][]): (string | number | null)[][] {
    const [titleRow, headerRow, ...dataRows] = data;
    if (!titleRow || !headerRow || dataRows.length === 0) return data;

    const countryIndex = headerRow.indexOf(COUNTRY_AREA_COLUMN);
    if (countryIndex < 0) return data;

    const yearColIndices = headerRow.map((_, i) => i).filter(i => i >= 2);

    const totalByCountryAndCol = sumByKey(
        dataRows.flatMap(row => {
            const country = String(row[countryIndex] ?? "");
            return yearColIndices.map(colIdx => ({
                key: `${country}|${colIdx}`,
                value: toSafeNumber(row[colIdx]),
            }));
        })
    );

    const normalizedRows = dataRows.map(row => {
        const country = String(row[countryIndex] ?? "");
        return row.map((cell, i) => {
            if (i === 1) return `${cell} (%)`;
            if (!yearColIndices.includes(i)) return cell;
            const total = totalByCountryAndCol[`${country}|${i}`] ?? 0;
            return toPercentage(cell, total);
        });
    });

    return [titleRow, headerRow, ...dataRows, ...normalizedRows];
}
