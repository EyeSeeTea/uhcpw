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
    return getTabsWithChartData(tabs, {
        chartName,
        headerDataParamName: HEADER_DATA_PARAM_NAME,
        headersBase: HEADERS_BASE,
        sortedDataParams: SORTED_PARAMETERS,
        dataParamToSortBy: DATA_PARAM_SORT_BY,
    });
};
