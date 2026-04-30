import { D2OrgUnit } from "../../repositories/indicator-explorer/AnalyticsD2Repository";
import {
    COUNTRY_YEAR_COLUMN,
    PARAMETER_COLUMN,
} from "../../repositories/indicator-explorer/utils/sortColumnsAndDataRows";
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
const HEADER_DATA_PARAM_NAME = PARAMETER_COLUMN;
const HEADERS_BASE = [COUNTRY_YEAR_COLUMN];
const DATA_PARAM_SORT_BY = "Medicines";

export const chart_mcNfvQaVbfy_exportedDataBuilder: (
    tabs: Tab[],
    chartName: string,
    orgUnits: D2OrgUnit[]
) => TabsWithStringOrNumbers[] = (tabs, chartName, orgUnits) => {
    return getTabsWithChartData(tabs, {
        chartName,
        headerDataParamName: HEADER_DATA_PARAM_NAME,
        headersBase: HEADERS_BASE,
        sortedDataParams: SORTED_PARAMETERS,
        dataParamToSortBy: DATA_PARAM_SORT_BY,
        hasCountryCodeRow: true,
        orgUnits,
    });
};
