import { DATA_TAB_NAME } from "../../repositories/indicator-explorer/AnalyticsD2Repository";
import { Tab, TabsWithStringOrNumbers } from "../exportToCSV";
import { getTabsWithChartData } from "./getTabsWithChartData";

const SORTED_PARAMETERS = ["All households", "Poorest consumption quintile"];
const HEADERS_BASE = ["Parameters / Country - Year"];
const HEADER_DATA_PARAM_NAME = "Parameter";
const DATA_PARAM_SORT_BY = "All households";

export const chart_WDUV9ZrJiNC_exportedDataBuilder: (tabs: Tab[], chartName: string) => TabsWithStringOrNumbers[] = (
    tabs,
    chartName
) => {
    const tabsWithExportedData: TabsWithStringOrNumbers[] = getTabsWithChartData(tabs, {
        chartName,
        headerDataParamName: HEADER_DATA_PARAM_NAME,
        headersBase: HEADERS_BASE,
        sortedDataParams: SORTED_PARAMETERS,
        dataParamToSortBy: DATA_PARAM_SORT_BY,
    });
    const data = tabsWithExportedData.find(tab => tab.name === DATA_TAB_NAME)?.data || [];

    const rowUsedToSort = data.find(row => row[0] === DATA_PARAM_SORT_BY);

    if (!rowUsedToSort) {
        throw new Error(`Row with parameter ${DATA_PARAM_SORT_BY} not found`);
    }

    const dataIndexes = rowUsedToSort.slice(1).map((_, i) => i);

    const sortedIndicesByZeroValuesAtTheEnd = dataIndexes.sort((a, b) => {
        if (a === 0 || b === 0) return 0;

        const aValue = rowUsedToSort[a];
        const bValue = rowUsedToSort[b];

        if (typeof aValue !== "number" || typeof bValue !== "number") return 0;

        return Number(aValue === 0) - Number(bValue === 0);
    });

    const dataWithZeroValuesAtTheEnd = data.map(row => sortedIndicesByZeroValuesAtTheEnd.map(i => row[i] ?? null));

    const sortedTabs = tabs.map((tab): TabsWithStringOrNumbers => {
        if (tab.name === DATA_TAB_NAME) {
            return {
                ...tab,
                data: dataWithZeroValuesAtTheEnd,
            };
        }
        return tab;
    });

    return sortedTabs;
};
