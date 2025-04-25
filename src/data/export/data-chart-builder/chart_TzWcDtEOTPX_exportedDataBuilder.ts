import { Tab, TabsWithStringOrNumbers } from "../exportToCSV";
import { getTabsWithChartData } from "./getTabsWithChartData";

const SORTED_PARAMETERS = [
    "Further impoverished",
    "Impoverished",
    "At risk of impoverishment",
    "Not at risk of impoverishment",
];
const HEADER_DATA_PARAM_NAME = "Parameter";
const HEADERS_BASE = ["Country", "Parameter"];

export const chart_TzWcDtEOTPX_exportedDataBuilder: (tabs: Tab[], chartName: string) => TabsWithStringOrNumbers[] = (
    tabs,
    chartName
) => {
    return getTabsWithChartData(tabs, {
        chartName,
        headerDataParamName: HEADER_DATA_PARAM_NAME,
        headersBase: HEADERS_BASE,
        sortedDataParams: SORTED_PARAMETERS,
        isCountryChart: true,
    });
};
