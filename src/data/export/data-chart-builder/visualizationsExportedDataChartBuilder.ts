import { chart_geNXcoXc3mf_exportedDataBuilder } from "./chart_geNXcoXc3mf_exportedDataBuilder";
import { chart_GimM6ANOKhd_exportedDataBuilder } from "./chart_GimM6ANOKhd_exportedDataBuilder";
import { chart_kIpnMBaBvZ9_exportedDataBuilder } from "./chart_kIpnMBaBvZ9_exportedDataBuilder";
import { Tab, TabsWithStringOrNumbers } from "../exportToCSV";
import { D2OrgUnit } from "../../repositories/indicator-explorer/AnalyticsD2Repository";
import { chart_hpO1ZyFXpCz_exportedDataBuilder } from "./chart_hpO1ZyFXpCz_exportedDataBuilder";
import { chart_VB7bdJ8ZXya_exportedDataBuilder } from "./chart_VB7bdJ8ZXya_exportedDataBuilder";

export const visualizationsExportedDataChartBuilder: Record<
    string,
    (tabs: Tab[], chartName: string, orgUnits: D2OrgUnit[]) => TabsWithStringOrNumbers[]
> = {
    geNXcoXc3mf: (tabs, chartName) => chart_geNXcoXc3mf_exportedDataBuilder(tabs, chartName),
    kIpnMBaBvZ9: (tabs, chartName, orgUnits) => chart_kIpnMBaBvZ9_exportedDataBuilder(tabs, chartName, orgUnits),
    GimM6ANOKhd: (tabs, chartName) => chart_GimM6ANOKhd_exportedDataBuilder(tabs, chartName),
    hpO1ZyFXpCz: (tabs, chartName) => chart_hpO1ZyFXpCz_exportedDataBuilder(tabs, chartName),
    VB7bdJ8ZXya: (tabs, chartName) => chart_VB7bdJ8ZXya_exportedDataBuilder(tabs, chartName),
};

export const columnLimitForDataChartById: Record<string, string> = {
    geNXcoXc3mf: "CZ",
    GimM6ANOKhd: "CZ",
    hpO1ZyFXpCz: "CZ",
    VB7bdJ8ZXya: "CZ",
};
