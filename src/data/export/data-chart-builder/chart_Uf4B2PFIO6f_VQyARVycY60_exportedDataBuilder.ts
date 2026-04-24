import {
    COUNTRY_AREA_COLUMN,
    INDICATOR_COLUMN,
} from "../../repositories/indicator-explorer/utils/sortColumnsAndDataRows";
import { Tab, TabsWithStringOrNumbers } from "../exportToCSV";
import { getTabsWithChartData } from "./getTabsWithChartData";

const SORTED_PARAMETERS = [
    "Share of households living below the basic needs line (%)",
    "Cost of meeting basic needs",
    "Average household capacity to pay",
];
const HEADER_DATA_PARAM_NAME = INDICATOR_COLUMN;
const HEADERS_BASE = [INDICATOR_COLUMN, COUNTRY_AREA_COLUMN];

export const chart_Uf4B2PFIO6f_VQyARVycY60_exportedDataBuilder: (
    tabs: Tab[],
    chartName: string
) => TabsWithStringOrNumbers[] = (tabs, chartName) => {
    return getTabsWithChartData(tabs, {
        chartName,
        headerDataParamName: HEADER_DATA_PARAM_NAME,
        headersBase: HEADERS_BASE,
        sortedDataParams: SORTED_PARAMETERS,
        isCountryChart: true,
    });
};
