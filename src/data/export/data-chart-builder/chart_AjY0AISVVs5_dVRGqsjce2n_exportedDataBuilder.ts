import {
    COUNTRY_AREA_COLUMN,
    INDICATOR_COLUMN,
} from "../../repositories/indicator-explorer/utils/sortColumnsAndDataRows";
import { Tab, TabsWithStringOrNumbers } from "../exportToCSV";
import { getTabsWithChartData } from "./getTabsWithChartData";

const SORTED_QUINTILES = ["<65", "65+", "LINE_65+", "Average"];

const HEADER_DATA_PARAM_NAME = INDICATOR_COLUMN;
const HEADERS_BASE = [COUNTRY_AREA_COLUMN, INDICATOR_COLUMN];

export const chart_AjY0AISVVs5_dVRGqsjce2n_exportedDataBuilder: (
    tabs: Tab[],
    chartName: string
) => TabsWithStringOrNumbers[] = (tabs, chartName) => {
    const tabsWithChart = getTabsWithChartData(tabs, {
        chartName,
        headerDataParamName: HEADER_DATA_PARAM_NAME,
        headersBase: HEADERS_BASE,
        sortedDataParams: SORTED_QUINTILES,
        isCountryChart: true,
    });

    const cleanedTabsWithChart = tabsWithChart.map(tab => {
        if (tab.name === "Data") {
            const cleanedData = tab.data.map(row => {
                return row.map(cell => {
                    if (typeof cell === "string") {
                        return cell.replace(/LINE_/g, "");
                    }
                    return cell;
                });
            });
            return { ...tab, data: cleanedData };
        }

        return tab;
    });

    return cleanedTabsWithChart;
};
