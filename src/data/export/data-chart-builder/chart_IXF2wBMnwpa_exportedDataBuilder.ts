import { D2OrgUnit, DATA_TAB_NAME } from "../../repositories/indicator-explorer/AnalyticsD2Repository";
import {
    PARAMETER_COLUMN,
    COUNTRY_YEAR_COLUMN,
} from "../../repositories/indicator-explorer/utils/sortColumnsAndDataRows";
import { Tab, TabsWithStringOrNumbers } from "../exportToCSV";
import { splitColumnRowsBy99, splitScatterRows, buildXAxisCategories } from "./chart_IXF2wBMnwpa_helpers";
import { getTabsWithChartData } from "./getTabsWithChartData";

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

    const countriesAndYearsUniqueCategories = buildXAxisCategories({
        scatterLowerThan99,
        columnRowsLowerThan99,
        scatterGreaterOrEqual99,
        columnRowsGreaterOrEqual99,
    });

    const tabsWithChart = getTabsWithChartData(tabs, {
        chartName,
        headerDataParamName: HEADER_DATA_PARAM_NAME,
        headersBase: HEADERS_BASE,
        sortedDataParams: SORTED_PARAMETERS,
        hasCountryCodeRow: true,
        orgUnits,
        countriesAndYearsUniqueParam: countriesAndYearsUniqueCategories,
    });

    const dataTabWithChart = tabsWithChart.find(tab => tab.name === DATA_TAB_NAME);
    if (!dataTabWithChart) {
        throw new Error("Data tab with chart data not found");
    }

    const dataWithAllHeaders = addPopulationCoverageHeaders(
        dataTabWithChart.data,
        chartName,
        columnRowsLowerThan99,
        columnRowsGreaterOrEqual99
    );

    return tabsWithChart.map(tab => {
        if (tab.name === DATA_TAB_NAME) {
            return {
                ...tab,
                data: dataWithAllHeaders,
            };
        }
        return tab;
    });
};

function addPopulationCoverageHeaders(
    data: Array<(string | number | null)[]>,
    chartName: string,
    columnRowsLowerThan99: Array<string[]>,
    columnRowsGreaterOrEqual99: Array<string[]>
): Array<(string | number | null)[]> {
    const hasLower = columnRowsLowerThan99.length > 0;
    const hasGreater = columnRowsGreaterOrEqual99.length > 0;

    const countryAndYearRow = data[1];
    const separatorIndex = countryAndYearRow?.findIndex(category => category === null) ?? 0;

    const populationCoverageHeaderText =
        hasGreater && !hasLower
            ? ["", "Population coverage > 99%"]
            : !hasGreater && hasLower
            ? ["", "Population coverage < 99%"]
            : Array.from({ length: separatorIndex + 2 }, (_, i) => {
                  if (i === 1) return "Population coverage > 99%";
                  if (i === separatorIndex + 1) return "Population coverage < 99%";
                  return null;
              });

    const chartData = data.slice(1);
    return [[chartName], populationCoverageHeaderText, ...chartData];
}
