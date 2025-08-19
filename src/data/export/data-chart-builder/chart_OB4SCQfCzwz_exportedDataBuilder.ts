import { Tab, TabsWithStringOrNumbers } from "../exportToCSV";
import { getTabsWithChartData } from "./getTabsWithChartData";

const SORTED_PARAMETERS = ["Voluntary health insurance", "Out-of-pocket payments", "Public spending on health"];
const HEADER_DATA_PARAM_NAME = "Parameter";
const HEADERS_BASE = ["Country / Area", "Parameter"];

export const chart_OB4SCQfCzwz_exportedDataBuilder: (tabs: Tab[], chartName: string) => TabsWithStringOrNumbers[] = (
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
