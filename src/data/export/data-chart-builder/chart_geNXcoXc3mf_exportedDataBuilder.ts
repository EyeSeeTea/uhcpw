import { DATA_TAB_NAME } from "../../repositories/indicator-explorer/AnalyticsD2Repository";
import { Tab, TabsWithStringOrNumbers } from "../exportToCSV";

const SORTED_QUINTILES = ["Poorest", "2nd", "3rd", "4th", "Richest"];

export const chart_geNXcoXc3mf_exportedDataBuilder: (tabs: Tab[], chartName: string) => TabsWithStringOrNumbers[] = (
    tabs,
    chartName
) => {
    const dataTab = tabs.find(tab => tab.name === DATA_TAB_NAME);
    if (!dataTab) {
        throw new Error("Data tab not found");
    }

    const headers = dataTab.data[1];
    const countryIndex = headers?.indexOf("Country");
    const quintileIndex = headers?.indexOf("Quintile");
    const yearIndex = headers?.indexOf("Year");
    const valueIndex = headers?.indexOf("Value");
    if (
        countryIndex === undefined ||
        countryIndex === -1 ||
        quintileIndex === undefined ||
        quintileIndex === -1 ||
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

    const headersBase = [["Country", "Quintile / Year", ...allYearsUnique]];

    const data = SORTED_QUINTILES.reduce(
        (acc: TabsWithStringOrNumbers["data"], quintile): TabsWithStringOrNumbers["data"] => {
            const quintileData = allYearsUnique.map(year => {
                const row = dataTab.data.find(
                    row => row[quintileIndex] === quintile && row[yearIndex] === year.toString()
                );
                const value = row ? row[valueIndex] : undefined;
                if (!row || !value) {
                    return 0;
                }
                return Number(value?.replace(",", "."));
            });
            return [...acc, [quintile, ...quintileData]];
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
