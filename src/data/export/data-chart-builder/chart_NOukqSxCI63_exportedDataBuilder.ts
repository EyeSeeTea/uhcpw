import { D2OrgUnit } from "../../repositories/indicator-explorer/AnalyticsD2Repository";
import {
    PARAMETER_COLUMN,
    COUNTRY_YEAR_COLUMN,
} from "../../repositories/indicator-explorer/utils/sortColumnsAndDataRows";
import { Tab, TabsWithStringOrNumbers } from "../exportToCSV";
import { getTabsWithChartData } from "./getTabsWithChartData";

const SORTED_PARAMETERS = ["Households with catastrophic health spending"];
const HEADER_DATA_PARAM_NAME = PARAMETER_COLUMN;
const HEADERS_BASE = [COUNTRY_YEAR_COLUMN];

export const chart_NOukqSxCI63_exportedDataBuilder: (
    tabs: Tab[],
    chartName: string,
    orgUnits: D2OrgUnit[]
) => TabsWithStringOrNumbers[] = (tabs, chartName, orgUnits) => {
    return getTabsWithChartData(tabs, {
        chartName,
        headerDataParamName: HEADER_DATA_PARAM_NAME,
        headersBase: HEADERS_BASE,
        sortedDataParams: SORTED_PARAMETERS,
        isSortByDataSum: true,
        hasCountryCodeRow: true,
        orgUnits,
    });
};
