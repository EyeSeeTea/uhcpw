import { CHART_TAB_NAME, DATA_TAB_NAME } from "../../repositories/indicator-explorer/AnalyticsD2Repository";
import { Tab, TabsWithStringOrNumbers } from "../exportToCSV";
import { parseDataValuesStringToNumber } from "../utils";

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
    const valueIndex = headers?.indexOf("Value");

    if (countryIndex === undefined || countryIndex === -1 || valueIndex === undefined || valueIndex === -1) {
        throw new Error("Missing required columns in the data tab");
    }

    const country = dataTab.data[2] ? dataTab.data[2][countryIndex] : "";

    if (!country) {
        throw new Error("Missing country in the data tab");
    }

    const headersBase = [["Country", "Quintile / Year"]];

    const data = SORTED_QUINTILES.reduce((acc: (string | number)[][], quintile): (string | number)[][] => {
        return [...acc, [quintile]];
    }, []).map(row => [country, ...row]);

    const chartTab = {
        name: CHART_TAB_NAME,
        data: [[chartName], ...headersBase, ...data],
    };

    const dataWithValueNumbers = parseDataValuesStringToNumber(dataTab.data, valueIndex);

    const dataTabWithNumbers = {
        name: DATA_TAB_NAME,
        data: dataWithValueNumbers,
    };

    const tabsWithoutDataTab = tabs.filter(tab => tab.name !== DATA_TAB_NAME);

    return [...tabsWithoutDataTab, dataTabWithNumbers, chartTab];
};
