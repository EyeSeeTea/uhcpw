import { D2OrgUnit } from "../../repositories/indicator-explorer/AnalyticsD2Repository";
import {
    COUNTRY_YEAR_COLUMN,
    QUINTILE_COLUMN,
} from "../../repositories/indicator-explorer/utils/sortColumnsAndDataRows";
import { Tab, TabsWithStringOrNumbers } from "../exportToCSV";
import { getTabsWithChartData } from "./getTabsWithChartData";

const SORTED_QUINTILES = ["Poorest", "2nd", "3rd", "4th", "Richest"];
const HEADER_DATA_PARAM_NAME = QUINTILE_COLUMN;
const HEADERS_BASE = [COUNTRY_YEAR_COLUMN];
const DATA_PARAM_SORT_BY = "Poorest";

export const chart_GimM6ANOKhd_exportedDataBuilder: (
    tabs: Tab[],
    chartName: string,
    orgUnits: D2OrgUnit[]
) => TabsWithStringOrNumbers[] = (tabs, chartName, orgUnits) => {
    return getTabsWithChartData(tabs, {
        chartName,
        headerDataParamName: HEADER_DATA_PARAM_NAME,
        headersBase: HEADERS_BASE,
        sortedDataParams: SORTED_QUINTILES,
        dataParamToSortBy: DATA_PARAM_SORT_BY,
        hasCountryCodeRow: true,
        orgUnits,
    });
};
