import { DATA_TAB_NAME } from "../../repositories/indicator-explorer/AnalyticsD2Repository";
import { Tab, TabsWithStringOrNumbers } from "../exportToCSV";

const SORTED_PARAMETERS = ["Further impoverished", "Impoverished"];

export const chart_jFtGKQIQTGp_exportedDataBuilder: (tabs: Tab[], chartName: string) => TabsWithStringOrNumbers[] = (
    tabs,
    chartName
) => {
    const dataTab = tabs.find(tab => tab.name === DATA_TAB_NAME);
    if (!dataTab) {
        throw new Error("Data tab not found");
    }

    const headers = dataTab.data[1];
    const countryIndex = headers?.indexOf("Country");
    const parameterIndex = headers?.indexOf("Parameter");
    const yearIndex = headers?.indexOf("Year");
    const valueIndex = headers?.indexOf("Value");
    if (
        countryIndex === undefined ||
        countryIndex === -1 ||
        parameterIndex === undefined ||
        parameterIndex === -1 ||
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

    const allYearsUnique = [...new Set(allYears)].map(year => Number(year));

    const headersBase = [["Country", "Parameter / Year", ...allYearsUnique]];

    const data = SORTED_PARAMETERS.reduce(
        (acc: TabsWithStringOrNumbers["data"], parameter): TabsWithStringOrNumbers["data"] => {
            const parameterData = allYearsUnique.map(year => {
                const row = dataTab.data.find(
                    row => row[parameterIndex] === parameter && row[yearIndex] === year.toString()
                );
                const value = row ? row[valueIndex] : undefined;
                if (!row || !value) {
                    return 0;
                }
                return Number(value?.replace(",", "."));
            });
            return [...acc, [parameter, ...parameterData]];
        },
        []
    ).map(row => [country, ...row]);

    const chartTab = {
        name: DATA_TAB_NAME,
        data: [[chartName], ...headersBase, ...data],
    };

    const tabsWithoutData = tabs.filter(tab => tab.name !== DATA_TAB_NAME);

    return [...tabsWithoutData, chartTab];
};
