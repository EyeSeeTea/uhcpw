import { DATA_TAB_NAME } from "../../repositories/indicator-explorer/AnalyticsD2Repository";
import { Tab, TabsWithStringOrNumbers } from "../exportToCSV";

export function getTabsWithChartDataWithSeriesByCategory(
    tabs: Tab[],
    options: {
        chartName: string;
        headerDataParamName: string;
        headerDataCategoryName: string;
        headersBase: string[];
        sortedDataParams: string[];
        sortedDataCategories: string[];
    }
): TabsWithStringOrNumbers[] {
    const {
        chartName,
        headerDataParamName,
        headerDataCategoryName,
        headersBase,
        sortedDataParams,
        sortedDataCategories,
    } = options;

    const dataTab = tabs.find(tab => tab.name === DATA_TAB_NAME);
    if (!dataTab) {
        throw new Error("Data tab not found");
    }

    const headers = dataTab.data[1];
    const countryIndex = headers?.indexOf("Country");
    const dataParamIndex = headers?.indexOf(headerDataParamName);
    const categoryIndex = headers?.indexOf(headerDataCategoryName);
    const yearIndex = headers?.indexOf("Year");
    const valueIndex = headers?.indexOf("Value");
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

    const allYearsUnique = [...new Set(allYears)].map(year => Number(year)).sort((yearA, yearB) => yearA - yearB);

    const restHeaders = allYearsUnique.reduce(
        (acc: string[], year: number) => [...acc, ...sortedDataCategories.map(category => `${year}-${category}`)],
        []
    );

    const finalHeaders = [[...headersBase, ...restHeaders]];

    const dataByDataParam: TabsWithStringOrNumbers["data"] = sortedDataParams
        .reduce((acc: TabsWithStringOrNumbers["data"], param): TabsWithStringOrNumbers["data"] => {
            const paramData = restHeaders.flatMap(yearAndQuintile => {
                const [year, category] = yearAndQuintile.split("-");
                const row = dataTab.data.find(
                    row =>
                        row[dataParamIndex] === param &&
                        row[yearIndex] === year?.toString() &&
                        row[categoryIndex] === category
                );
                const value = row ? row[valueIndex] : undefined;
                if (!row || !value) {
                    return 0;
                }
                return Number(value?.replace(",", "."));
            });
            return [...acc, [param, ...paramData]];
        }, [])
        .map(row => [country, ...row]);

    const data = [[chartName], ...finalHeaders, ...dataByDataParam];

    const chartTab = {
        name: DATA_TAB_NAME,
        data: data,
    };

    const tabsWithoutData = tabs.filter(tab => tab.name !== DATA_TAB_NAME);

    return [...tabsWithoutData, chartTab];
}
