import {
    COUNTRY_AREA_COLUMN,
    QUINTILE_COLUMN,
} from "../../repositories/indicator-explorer/utils/sortColumnsAndDataRows";
import { Tab, TabsWithStringOrNumbers } from "../exportToCSV";
import { getTabsWithChartData } from "./getTabsWithChartData";

const SORTED_QUINTILES = ["Poorest", "2nd", "3rd", "4th", "Richest"];
const HEADER_DATA_PARAM_NAME = QUINTILE_COLUMN;
const HEADERS_BASE = [COUNTRY_AREA_COLUMN, QUINTILE_COLUMN];

export const chart_geNXcoXc3mf_exportedDataBuilder: (tabs: Tab[], chartName: string) => TabsWithStringOrNumbers[] = (
    tabs,
    chartName
) => {
    return getTabsWithChartData(tabs, {
        chartName,
        headerDataParamName: HEADER_DATA_PARAM_NAME,
        headersBase: HEADERS_BASE,
        sortedDataParams: SORTED_QUINTILES,
        isCountryChart: true,
    });
};
