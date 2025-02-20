import { chart_geNXcoXc3mf_exportedDataBuilder } from "./chart_geNXcoXc3mf_exportedDataBuilder_formula";
import { chart_GimM6ANOKhd_exportedDataBuilder } from "./chart_GimM6ANOKhd_exportedDataBuilder_formula";
import { chart_kIpnMBaBvZ9_exportedDataBuilder } from "./chart_kIpnMBaBvZ9_exportedDataBuilder_formula_colors";
import { Tab, TabsWithStringOrNumbers } from "../exportToCSV";

export const visualizationsExportedDataChartBuilder: Record<
    string,
    (tabs: Tab[], chartName: string) => TabsWithStringOrNumbers[]
> = {
    geNXcoXc3mf: (tabs, chartName) => chart_geNXcoXc3mf_exportedDataBuilder(tabs, chartName),
    kIpnMBaBvZ9: (tabs, chartName) => chart_kIpnMBaBvZ9_exportedDataBuilder(tabs, chartName),
    GimM6ANOKhd: (tabs, chartName) => chart_GimM6ANOKhd_exportedDataBuilder(tabs, chartName),
};
