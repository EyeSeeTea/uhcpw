import {
    PARAMETER_COLUMN,
    QUINTILE_COLUMN,
    COUNTRY_AREA_COLUMN,
    TYPE_OF_CARE_COLUMN,
    YEAR_QUINTILE_COLUMN,
} from "../../repositories/indicator-explorer/utils/sortColumnsAndDataRows";
import { DATA_TAB_NAME } from "../../repositories/indicator-explorer/AnalyticsD2Repository";
import { Tab, TabsWithStringOrNumbers } from "../exportToCSV";
import {
    getTabsWithChartDataWithSeriesByCategory,
    YEAR_CATEGORY_SEPARATOR,
} from "./getTabsWithChartDataWithSeriesByCategory";

const SORTED_PARAMETERS = [
    "Medicines",
    "Dental care",
    "Medical products",
    "Inpatient care",
    "Outpatient care",
    "Diagnostic tests",
];
const HEADER_DATA_PARAM_NAME = PARAMETER_COLUMN;
const HEADER_DATA_QUINTILE_NAME = QUINTILE_COLUMN;
const HEADERS_BASE = [COUNTRY_AREA_COLUMN, YEAR_QUINTILE_COLUMN];
const SORTED_QUINTILES = ["Poorest", "2nd", "3rd", "4th", "Richest"];

export const chart_q5ldoFcgkSn_or_ZxNdsDM8NSb_exportedDataBuilder: (
    tabs: Tab[],
    chartName: string
) => TabsWithStringOrNumbers[] = (tabs, chartName) => {
    const result = getTabsWithChartDataWithSeriesByCategory(tabs, {
        chartName,
        headerDataParamName: HEADER_DATA_PARAM_NAME,
        headerDataCategoryName: HEADER_DATA_QUINTILE_NAME,
        headersBase: HEADERS_BASE,
        sortedDataParams: SORTED_PARAMETERS,
        sortedDataCategories: SORTED_QUINTILES,
    });

    return result.map(tab => {
        if (tab.name !== DATA_TAB_NAME) return tab;
        const [, yearQuintileRow = [], ...dataRows] = tab.data;

        const yearQuintileCells = yearQuintileRow.slice(HEADERS_BASE.length);
        const years = yearQuintileCells.map(cell =>
            typeof cell === "string" ? cell.split(YEAR_CATEGORY_SEPARATOR)[0] ?? null : null
        );
        const quintiles = yearQuintileCells.map(cell =>
            typeof cell === "string" ? cell.split(YEAR_CATEGORY_SEPARATOR)[1] ?? null : null
        );
        return {
            ...tab,
            data: [
                [chartName],
                [null, null, ...years],
                [COUNTRY_AREA_COLUMN, TYPE_OF_CARE_COLUMN, ...quintiles],
                yearQuintileRow,
                ...dataRows,
            ],
        };
    });
};
