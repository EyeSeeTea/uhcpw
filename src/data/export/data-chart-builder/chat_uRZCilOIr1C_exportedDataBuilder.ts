import { Tab, TabsWithStringOrNumbers } from "../exportToCSV";
import { getTabsWithChartData } from "./getTabsWithChartData";

const SORTED_QUINTILES = ["Poorest", "2nd", "3rd", "4th", "Richest", "Total"];
const HEADER_DATA_PARAM_NAME = "Parameter";
const HEADERS_BASE = ["Country / Area", "Quintile"];

export const chat_uRZCilOIr1C_exportedDataBuilder: (tabs: Tab[], chartName: string) => TabsWithStringOrNumbers[] = (
    tabs,
    chartName
) => {
    return getTabsWithChartData(tabs, {
        chartName,
        headerDataParamName: HEADER_DATA_PARAM_NAME,
        headersBase: HEADERS_BASE,
        sortedDataParams: SORTED_QUINTILES,
        isCountryChart: true,
    });
};
