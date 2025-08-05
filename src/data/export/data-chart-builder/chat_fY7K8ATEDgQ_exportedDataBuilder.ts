import { Tab, TabsWithStringOrNumbers } from "../exportToCSV";
import { getTabsWithChartDataWithSeriesByCategory } from "./getTabsWithChartDataWithSeriesByCategory";

const SORTED_PARAMETERS = [
    "Inpatient care",
    "Medicines",
    "Dental care",
    "Outpatient care",
    "Medical products",
    "Diagnostic tests",
];
const HEADER_DATA_PARAM_NAME = "Parameter";
const HEADER_DATA_QUINTILE_NAME = "Quintile";
const HEADERS_BASE = ["Country / Area", "Parameter / Year - Quintile"];
const SORTED_QUINTILES = ["Poorest", "2nd", "3rd", "4th", "Richest"];

export const chat_fY7K8ATEDgQ_exportedDataBuilder: (tabs: Tab[], chartName: string) => TabsWithStringOrNumbers[] = (
    tabs,
    chartName
) => {
    return getTabsWithChartDataWithSeriesByCategory(tabs, {
        chartName,
        headerDataParamName: HEADER_DATA_PARAM_NAME,
        headerDataCategoryName: HEADER_DATA_QUINTILE_NAME,
        headersBase: HEADERS_BASE,
        sortedDataParams: SORTED_PARAMETERS,
        sortedDataCategories: SORTED_QUINTILES,
    });
};
