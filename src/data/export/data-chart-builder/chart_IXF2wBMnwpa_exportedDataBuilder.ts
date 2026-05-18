import { D2OrgUnit, DATA_TAB_NAME } from "../../repositories/indicator-explorer/AnalyticsD2Repository";
import {
    PARAMETER_COLUMN,
    COUNTRY_YEAR_COLUMN,
} from "../../repositories/indicator-explorer/utils/sortColumnsAndDataRows";
import { Tab, TabsWithStringOrNumbers } from "../exportToCSV";
import { getTabsWithChartData } from "./getTabsWithChartData";
import {
    buildXAxisCategories,
    splitColumnRowsBy99,
    splitScatterRows,
} from "../../../webapp/components/visualization/manual/utils/IXF2wBMnwpa_Helpers";

const COLUMN_ROWS = ["Population covered (residence)", "Population covered (payment of contributions)"];
const SCATTER_ROW = "Households with catastrophic health spending";
const SORTED_PARAMETERS = [...COLUMN_ROWS, SCATTER_ROW];
const HEADER_DATA_PARAM_NAME = PARAMETER_COLUMN;
const HEADERS_BASE = [COUNTRY_YEAR_COLUMN];

export const chart_IXF2wBMnwpa_exportedDataBuilder: (
    tabs: Tab[],
    chartName: string,
    orgUnits: D2OrgUnit[]
) => TabsWithStringOrNumbers[] = (tabs, chartName, orgUnits) => {
    const dataTab = tabs.find(tab => tab.name === DATA_TAB_NAME);
    if (!dataTab) {
        throw new Error("Data tab not found");
    }

    const columnRows = dataTab.data.filter(rows => {
        const seriesName = rows[0];
        return seriesName && COLUMN_ROWS.includes(seriesName);
    });
    const scatterRows = dataTab.data.filter(row => row[0] === SCATTER_ROW);

    const { columnRowsLowerThan99, columnRowsGreaterOrEqual99 } = splitColumnRowsBy99(columnRows);
    const { scatterLowerThan99, scatterGreaterOrEqual99 } = splitScatterRows({
        scatterRows,
        columnRowsLowerThan99,
        columnRowsGreaterOrEqual99,
    });

    const categories = buildXAxisCategories({
        scatterLowerThan99,
        columnRowsLowerThan99,
        scatterGreaterOrEqual99,
        columnRowsGreaterOrEqual99,
    });

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
