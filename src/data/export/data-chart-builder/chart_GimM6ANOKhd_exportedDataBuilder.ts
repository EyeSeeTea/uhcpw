import { DATA_TAB_NAME, CHART_TAB_NAME } from "../../repositories/indicator-explorer/AnalyticsD2Repository";
import { Tab, TabsWithStringOrNumbers } from "../exportToCSV";
import { parseDataValuesStringToNumber } from "../utils";

const SORTED_QUINTILES = ["Poorest", "2nd", "3rd", "4th", "Richest"];

export const chart_GimM6ANOKhd_exportedDataBuilder: (tabs: Tab[], chartName: string) => TabsWithStringOrNumbers[] = (
    tabs,
    chartName
) => {
    const dataTab = tabs.find(tab => tab.name === DATA_TAB_NAME);

    if (!dataTab) {
        throw new Error("Data tab not found");
    }

    const headers = dataTab.data[1];

    const valueIndex = headers?.indexOf("Value");

    if (valueIndex === undefined || valueIndex === -1) {
        throw new Error("Missing required columns in the data tab");
    }

    const firstColumnBase = ["Country", "Year", "Label", ...SORTED_QUINTILES];

    const chartTab = {
        name: CHART_TAB_NAME,
        data: [[chartName], ...firstColumnBase.map(row => [row])],
    };

    const dataWithValueNumbers = parseDataValuesStringToNumber(dataTab.data, valueIndex);

    const dataTabWithNumbers = {
        name: DATA_TAB_NAME,
        data: dataWithValueNumbers,
    };

    const tabsWithoutDataTab = tabs.filter(tab => tab.name !== DATA_TAB_NAME);

    return [...tabsWithoutDataTab, dataTabWithNumbers, chartTab];
};
