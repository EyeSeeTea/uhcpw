import { Tab, TabsWithStringOrNumbers } from "../exportToCSV";
import { getTabsWithChartData } from "./getTabsWithChartData";

const SORTED_PARAMETERS = ["Further impoverished", "Impoverished"];
const HEADER_DATA_PARAM_NAME = "Parameter";
const HEADERS_BASE = ["Parameters / Country - Year"];

export const chart_dbc87Ljw8uN_exportedDataBuilder: (tabs: Tab[], chartName: string) => TabsWithStringOrNumbers[] = (
    tabs,
    chartName
) => {
    return getTabsWithChartData(tabs, {
        chartName,
        headerDataParamName: HEADER_DATA_PARAM_NAME,
        headersBase: HEADERS_BASE,
        sortedDataParams: SORTED_PARAMETERS,
        isSortByDataSum: true,
    });
};
