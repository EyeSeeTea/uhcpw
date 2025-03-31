import { chart_geNXcoXc3mf_exportedDataBuilder } from "./chart_geNXcoXc3mf_exportedDataBuilder";
import { chart_GimM6ANOKhd_exportedDataBuilder } from "./chart_GimM6ANOKhd_exportedDataBuilder";
import { chart_kIpnMBaBvZ9_exportedDataBuilder } from "./chart_kIpnMBaBvZ9_exportedDataBuilder";
import { Tab, TabsWithStringOrNumbers } from "../exportToCSV";
import { D2OrgUnit } from "../../repositories/indicator-explorer/AnalyticsD2Repository";
import { chart_WDUV9ZrJiNC_exportedDataBuilder } from "./chart_WDUV9ZrJiNC_exportedDataBuilder";
import { chart_jFtGKQIQTGp_exportedDataBuilder } from "./chart_jFtGKQIQTGp_exportedDataBuilder";
import { chart_dbc87Ljw8uN_exportedDataBuilder } from "./chart_dbc87Ljw8uN_exportedDataBuilder";

export const visualizationsExportedDataChartBuilder: Record<
    string,
    (tabs: Tab[], chartName: string, orgUnits: D2OrgUnit[]) => TabsWithStringOrNumbers[]
> = {
    geNXcoXc3mf: (tabs, chartName) => chart_geNXcoXc3mf_exportedDataBuilder(tabs, chartName),
    kIpnMBaBvZ9: (tabs, chartName, orgUnits) => chart_kIpnMBaBvZ9_exportedDataBuilder(tabs, chartName, orgUnits),
    GimM6ANOKhd: (tabs, chartName) => chart_GimM6ANOKhd_exportedDataBuilder(tabs, chartName),
    WDUV9ZrJiNC: (tabs, chartName) => chart_WDUV9ZrJiNC_exportedDataBuilder(tabs, chartName),
    jFtGKQIQTGp: (tabs, chartName) => chart_jFtGKQIQTGp_exportedDataBuilder(tabs, chartName),
    dbc87Ljw8uN: (tabs, chartName) => chart_dbc87Ljw8uN_exportedDataBuilder(tabs, chartName),
};

export const columnLimitForDataChartById: Record<string, string> = {
    geNXcoXc3mf: "CZ",
    GimM6ANOKhd: "CZ",
    WDUV9ZrJiNC: "CZ",
    jFtGKQIQTGp: "CZ",
    dbc87Ljw8uN: "CZ",
};
