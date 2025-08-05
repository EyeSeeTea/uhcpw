import { Tab, TabsWithStringOrNumbers } from "../exportToCSV";
import { getTabsWithChartDataWithSeriesByCategory } from "./getTabsWithChartDataWithSeriesByCategory";

const SORTED_PARAMETERS = ["Out-of-pocket payments", "Voluntary health insurance", "Public spending on health"];
const HEADER_DATA_PARAM_NAME = "Financing scheme";
const HEADER_DATA_CATEGORY_NAME = "Type of care";
const HEADERS_BASE = ["Country / Area", "Parameter"];
const SORTED_CATEGORIES = [
    "Inpatient care",
    "Outpatient care",
    "Medicines",
    "Medical products",
    "Dental care",
    "Diagnostic tests",
];

export const chart_z6nPPMMbOw5_exportedDataBuilder: (tabs: Tab[], chartName: string) => TabsWithStringOrNumbers[] = (
    tabs,
    chartName
) => {
    return getTabsWithChartDataWithSeriesByCategory(tabs, {
        chartName,
        headerDataParamName: HEADER_DATA_PARAM_NAME,
        headerDataCategoryName: HEADER_DATA_CATEGORY_NAME,
        headersBase: HEADERS_BASE,
        sortedDataParams: SORTED_PARAMETERS,
        sortedDataCategories: SORTED_CATEGORIES,
    });
};
