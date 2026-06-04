import {
    COUNTRY_AREA_COLUMN,
    PARAMETER_COLUMN,
    QUINTILE_COLUMN,
} from "../../repositories/indicator-explorer/utils/sortColumnsAndDataRows";
import { Tab, TabsWithStringOrNumbers } from "../exportToCSV";
import { getTabsWithChartDataWithSeriesByCategory } from "./getTabsWithChartDataWithSeriesByCategory";

const SORTED_TYPES_OF_CARE = [
    "Inpatient care",
    "Medicines",
    "Dental care",
    "Outpatient care",
    "Medical products",
    "Diagnostic tests",
];
const HEADER_DATA_PARAM_NAME = PARAMETER_COLUMN;
const HEADER_DATA_QUINTILE_NAME = QUINTILE_COLUMN;
const HEADERS_BASE = [COUNTRY_AREA_COLUMN, QUINTILE_COLUMN];
const SORTED_QUINTILES = ["Poorest", "2nd", "3rd", "4th", "Richest"];

export const chat_fY7K8ATEDgQ_exportedDataBuilder: (tabs: Tab[], chartName: string) => TabsWithStringOrNumbers[] = (
    tabs,
    chartName
) => {
    return getTabsWithChartDataWithSeriesByCategory(tabs, {
        chartName,
        headerDataParamName: HEADER_DATA_QUINTILE_NAME,
        headerDataCategoryName: HEADER_DATA_PARAM_NAME,
        headersBase: HEADERS_BASE,
        sortedDataParams: SORTED_QUINTILES,
        sortedDataCategories: SORTED_TYPES_OF_CARE,
        splitYearAndCategoryHeaders: true,
    });
};
