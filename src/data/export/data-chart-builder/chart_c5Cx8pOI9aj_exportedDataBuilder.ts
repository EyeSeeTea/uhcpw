import { D2OrgUnit } from "../../repositories/indicator-explorer/AnalyticsD2Repository";
import { COUNTRY_YEAR_COLUMN } from "../../repositories/indicator-explorer/utils/sortColumnsAndDataRows";
import { Tab, TabsWithStringOrNumbers } from "../exportToCSV";
import { getTabsWithLineChartData } from "./getTabsWithChartData";

const HEADERS_BASE = [COUNTRY_YEAR_COLUMN];

export const chart_c5Cx8pOI9aj_exportedDataBuilder: (
    tabs: Tab[],
    chartName: string,
    orgUnits: D2OrgUnit[]
) => TabsWithStringOrNumbers[] = (tabs, chartName, orgUnits) => {
    return getTabsWithLineChartData(tabs, {
        chartName,
        orgUnits,
        headersBase: HEADERS_BASE,
    });
};
