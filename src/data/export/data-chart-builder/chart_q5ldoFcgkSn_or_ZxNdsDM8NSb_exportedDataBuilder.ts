import { Tab, TabsWithStringOrNumbers } from "../exportToCSV";
import { getTabsWithChartDataWithSeriesByCategory } from "./getTabsWithChartDataWithSeriesByCategory";

const SORTED_PARAMETERS = [
    "Medicines",
    "Dental care",
    "Medical products",
    "Inpatient care",
    "Outpatient care",
    "Diagnostic tests",
];
const HEADER_DATA_PARAM_NAME = "Parameter";
const HEADER_DATA_QUINTILE_NAME = "Quintile";
const HEADERS_BASE = ["Country / Area", "Year Quintile"];
const SORTED_QUINTILES = ["Poorest", "2nd", "3rd", "4th", "Richest"];

export const chart_q5ldoFcgkSn_or_ZxNdsDM8NSb_exportedDataBuilder: (
    tabs: Tab[],
    chartName: string
) => TabsWithStringOrNumbers[] = (tabs, chartName) => {
    return getTabsWithChartDataWithSeriesByCategory(tabs, {
        chartName,
        headerDataParamName: HEADER_DATA_PARAM_NAME,
        headerDataCategoryName: HEADER_DATA_QUINTILE_NAME,
        headersBase: HEADERS_BASE,
        sortedDataParams: SORTED_PARAMETERS,
        sortedDataCategories: SORTED_QUINTILES,
    });
};
