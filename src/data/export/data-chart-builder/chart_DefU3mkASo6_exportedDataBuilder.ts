import { D2OrgUnit, DATA_TAB_NAME } from "../../repositories/indicator-explorer/AnalyticsD2Repository";
import {
    PARAMETER_COLUMN,
    COUNTRY_YEAR_COLUMN,
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
const HEADER_DATA_PARAM_NAME = PARAMETER_COLUMN;
const HEADERS_BASE = [COUNTRY_YEAR_COLUMN];

export const chart_DefU3mkASo6_exportedDataBuilder: (
    tabs: Tab[],
    chartName: string,
    orgUnits: D2OrgUnit[]
) => TabsWithStringOrNumbers[] = (tabs, chartName, orgUnits) => {
    const tabsWithChartData = getTabsWithChartData(tabs, {
        chartName,
        headerDataParamName: HEADER_DATA_PARAM_NAME,
        headersBase: HEADERS_BASE,
        sortedDataParams: SORTED_PARAMETERS,
        isSortByDataSum: true,
        hasCountryCodeRow: true,
        orgUnits,
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
    const [titleRow, fullHeaderRow, abbrevHeaderRow, ...dataRows] = data;
    if (!titleRow || !fullHeaderRow || !abbrevHeaderRow || dataRows.length === 0) return data;

    const valueColIndices = fullHeaderRow.map((_, i) => i).filter(i => i >= 1);

    const totalByCol = sumByKey(
        dataRows.flatMap(row =>
            valueColIndices.map(colIdx => ({
                key: String(colIdx),
                value: toSafeNumber(row[colIdx]),
            }))
        )
    );

    const normalizedRows = dataRows.map(row =>
        row.map((cell, i) => {
            if (i === 0) return `${cell} (%)`;
            if (!valueColIndices.includes(i)) return cell;
            const total = totalByCol[String(i)] ?? 0;
            return toPercentage(cell, total);
        })
    );

    return [titleRow, fullHeaderRow, abbrevHeaderRow, ...dataRows, ...normalizedRows];
}
