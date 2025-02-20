import { DATA_TAB_NAME, CHART_TAB_NAME } from "../../repositories/indicator-explorer/AnalyticsD2Repository";
import { Tab, TabsWithStringOrNumbers } from "../exportToCSV";

export const chart_kIpnMBaBvZ9_exportedDataBuilder: (tabs: Tab[], chartName: string) => TabsWithStringOrNumbers[] = (
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

    const headersBase = [["Country / Parameter", "Year"]];

    const chartTab = {
        name: CHART_TAB_NAME,
        data: [[chartName], ...headersBase],
    };

    const dataWithValueNumbers = dataTab.data.map((row, rowNumber) => {
        const value = row[valueIndex];
        if (!value || rowNumber === 0 || rowNumber === 1) {
            return row;
        }

        return [...row.slice(0, valueIndex), Number(value.replace(",", ".")), ...row.slice(valueIndex + 1)];
    });

    const dataTabWithNumbers = {
        name: DATA_TAB_NAME,
        data: dataWithValueNumbers,
    };

    const tabsWithoutDataTab = tabs.filter(tab => tab.name !== DATA_TAB_NAME);

    return [...tabsWithoutDataTab, dataTabWithNumbers, chartTab];
};
