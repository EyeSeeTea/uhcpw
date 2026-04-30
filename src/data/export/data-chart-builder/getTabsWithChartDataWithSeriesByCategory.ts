import { DATA_TAB_NAME } from "../../repositories/indicator-explorer/AnalyticsD2Repository";
import {
    COUNTRY_AREA_COLUMN,
    VALUE_COLUMN,
    YEAR_COLUMN,
} from "../../repositories/indicator-explorer/utils/sortColumnsAndDataRows";
import { Tab, TabsWithStringOrNumbers } from "../exportToCSV";

const YEAR_CATEGORY_SEPARATOR = " ";

export function getTabsWithChartDataWithSeriesByCategory(
    tabs: Tab[],
    options: {
        chartName: string;
        headerDataParamName: string;
        headerDataCategoryName: string;
        headersBase: string[];
        sortedDataParams: string[];
        sortedDataCategories: string[];
        splitYearAndCategoryHeaders?: boolean;
    }
): TabsWithStringOrNumbers[] {
    const {
        chartName,
        headerDataParamName,
        headerDataCategoryName,
        headersBase,
        sortedDataParams,
        sortedDataCategories,
        splitYearAndCategoryHeaders = false,
    } = options;

    const dataTab = tabs.find(tab => tab.name === DATA_TAB_NAME);
    if (!dataTab) {
        throw new Error("Data tab not found");
    }

    const headers = dataTab.data[1];
    const countryIndex = headers?.indexOf(COUNTRY_AREA_COLUMN);
    const dataParamIndex = headers?.indexOf(headerDataParamName);
    const categoryIndex = headers?.indexOf(headerDataCategoryName);
    const yearIndex = headers?.indexOf(YEAR_COLUMN);
    const valueIndex = headers?.indexOf(VALUE_COLUMN);
    if (
        countryIndex === undefined ||
        countryIndex === -1 ||
        dataParamIndex === undefined ||
        dataParamIndex === -1 ||
        categoryIndex === undefined ||
        categoryIndex === -1 ||
        yearIndex === undefined ||
        yearIndex === -1 ||
        valueIndex === undefined ||
        valueIndex === -1
    ) {
        throw new Error("Missing required columns in the data tab");
    }

    const country = dataTab.data[2] ? dataTab.data[2][countryIndex] : "";
    if (!country) {
        throw new Error("Missing country in the data tab");
    }

    const allYears = dataTab.data
        .slice(2)
        .map(row => row[yearIndex])
        .filter((year): year is string => year !== undefined);

    const uniqueYears = [...new Set(allYears)].sort((a, b) => Number(a) - Number(b));

    const yearCategoryKeys = uniqueYears.flatMap(year => sortedDataCategories.map(category => ({ year, category })));

    const finalHeaders = splitYearAndCategoryHeaders
        ? [
              [...headersBase.map(() => ""), ...yearCategoryKeys.map(({ year }) => year)],
              [...headersBase, ...yearCategoryKeys.map(({ category }) => category)],
          ]
        : [
              [
                  ...headersBase,
                  ...yearCategoryKeys.map(({ year, category }) => `${year}${YEAR_CATEGORY_SEPARATOR}${category}`),
              ],
          ];

    const dataByDataParam: TabsWithStringOrNumbers["data"] = sortedDataParams.map((param): (string | number)[] => {
        const paramData = yearCategoryKeys.map(({ year, category }) => {
            const row = dataTab.data.find(
                candidate =>
                    candidate[dataParamIndex] === param &&
                    candidate[yearIndex] === year &&
                    candidate[categoryIndex] === category
            );
            const value = row ? row[valueIndex] : undefined;
            return !row || !value ? 0 : Number(value.replace(",", "."));
        });
        return [country, param, ...paramData];
    });

    const data = [[chartName], ...finalHeaders, ...dataByDataParam];

    const chartTab = {
        name: DATA_TAB_NAME,
        data: data,
    };

    const tabsWithoutData = tabs.filter(tab => tab.name !== DATA_TAB_NAME);

    return [...tabsWithoutData, chartTab];
}
