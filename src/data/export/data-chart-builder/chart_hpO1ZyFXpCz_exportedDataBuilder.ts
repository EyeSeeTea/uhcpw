import { Tab, TabsWithStringOrNumbers } from "../exportToCSV";
import { getTabsWithChartData } from "./getTabsWithChartData";

const SORTED_PARAMETERS = [
    "Medicines",
    "Dental care",
    "Medical products",
    "Inpatient care",
    "Outpatient care",
    "Diagnostic tests",
];
const HEADER_DATA_PARAM_NAME = "Parameter";
const HEADERS_BASE = ["Country / Area", "Parameter"];

export const chart_hpO1ZyFXpCz_exportedDataBuilder: (tabs: Tab[], chartName: string) => TabsWithStringOrNumbers[] = (
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
