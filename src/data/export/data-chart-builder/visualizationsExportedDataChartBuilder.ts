import { chart_geNXcoXc3mf_exportedDataBuilder } from "./chart_geNXcoXc3mf_exportedDataBuilder";
import { chart_GimM6ANOKhd_exportedDataBuilder } from "./chart_GimM6ANOKhd_exportedDataBuilder";
import { chart_kIpnMBaBvZ9_exportedDataBuilder } from "./chart_kIpnMBaBvZ9_exportedDataBuilder";
import { Tab, TabsWithStringOrNumbers } from "../exportToCSV";
import { D2OrgUnit, D2OrgUnitGroup } from "../../repositories/indicator-explorer/AnalyticsD2Repository";
import { chart_hpO1ZyFXpCz_exportedDataBuilder } from "./chart_hpO1ZyFXpCz_exportedDataBuilder";
import { chart_VB7bdJ8ZXya_exportedDataBuilder } from "./chart_VB7bdJ8ZXya_exportedDataBuilder";
import { chart_WDUV9ZrJiNC_exportedDataBuilder } from "./chart_WDUV9ZrJiNC_exportedDataBuilder";
import { chart_jFtGKQIQTGp_exportedDataBuilder } from "./chart_jFtGKQIQTGp_exportedDataBuilder";
import { chart_dbc87Ljw8uN_exportedDataBuilder } from "./chart_dbc87Ljw8uN_exportedDataBuilder";
import { chart_mcNfvQaVbfy_exportedDataBuilder } from "./chart_mcNfvQaVbfy_exportedDataBuilder";
import { chart_q5ldoFcgkSn_or_ZxNdsDM8NSb_exportedDataBuilder } from "./chart_q5ldoFcgkSn_or_ZxNdsDM8NSb_exportedDataBuilder";
import { chart_pWFRTFfh5mA_exportedDataBuilder } from "./chart_pWFRTFfh5mA_exportedDataBuilder";
import { chat_uRZCilOIr1C_exportedDataBuilder } from "./chat_uRZCilOIr1C_exportedDataBuilder";
import { chart_cGE32OzPgMS_exportedDataBuilder } from "./chart_cGE32OzPgMS_exportedDataBuilder";
import { chat_fY7K8ATEDgQ_exportedDataBuilder } from "./chat_fY7K8ATEDgQ_exportedDataBuilder";
import { chart_z6nPPMMbOw5_exportedDataBuilder } from "./chart_z6nPPMMbOw5_exportedDataBuilder";
import { chart_Y31jQX5PVdI_exportedDataBuilder } from "./chart_Y31jQX5PVdI_exportedDataBuilder";
import { chart_TzWcDtEOTPX_exportedDataBuilder } from "./chart_TzWcDtEOTPX_exportedDataBuilder";
import { chart_NOR4oxtMVxP_exportedDataBuilder } from "./chart_NOR4oxtMVxP_exportedDataBuilder";
import { chart_Uf4B2PFIO6f_VQyARVycY60_exportedDataBuilder } from "./chart_Uf4B2PFIO6f_VQyARVycY60_exportedDataBuilder";
import { chart_rT39aStYqI3_exportedDataBuilder } from "./chart_rT39aStYqI3_exportedDataBuilder";
import { chart_nhaxK33nlhb_exportedDataBuilder } from "./chart_nhaxK33nlhb_exportedDataBuilder";
import { chart_OB4SCQfCzwz_exportedDataBuilder } from "./chart_OB4SCQfCzwz_exportedDataBuilder";
import { chart_sjgCABd3zK7_exportedDataBuilder } from "./chart_sjgCABd3zK7_exportedDataBuilder";
import { chart_qipBCG0Hc9Y_exportedDataBuilder } from "./chart_qipBCG0Hc9Y_exportedDataBuilder";

type ExportedDataChartBuilder = (
    tabs: Tab[],
    chartName: string,
    orgUnits: D2OrgUnit[],
    orgUnitGroups: D2OrgUnitGroup[]
) => TabsWithStringOrNumbers[];

export const visualizationsExportedDataChartBuilder: Record<string, ExportedDataChartBuilder> = {
    geNXcoXc3mf: (tabs, chartName) => chart_geNXcoXc3mf_exportedDataBuilder(tabs, chartName),
    kIpnMBaBvZ9: (tabs, chartName, orgUnits) => chart_kIpnMBaBvZ9_exportedDataBuilder(tabs, chartName, orgUnits),
    GimM6ANOKhd: (tabs, chartName, orgUnits) => chart_GimM6ANOKhd_exportedDataBuilder(tabs, chartName, orgUnits),
    hpO1ZyFXpCz: (tabs, chartName) => chart_hpO1ZyFXpCz_exportedDataBuilder(tabs, chartName),
    VB7bdJ8ZXya: (tabs, chartName, orgUnits) => chart_VB7bdJ8ZXya_exportedDataBuilder(tabs, chartName, orgUnits),
    WDUV9ZrJiNC: (tabs, chartName, orgUnits) => chart_WDUV9ZrJiNC_exportedDataBuilder(tabs, chartName, orgUnits),
    jFtGKQIQTGp: (tabs, chartName) => chart_jFtGKQIQTGp_exportedDataBuilder(tabs, chartName),
    dbc87Ljw8uN: (tabs, chartName, orgUnits) => chart_dbc87Ljw8uN_exportedDataBuilder(tabs, chartName, orgUnits),
    mcNfvQaVbfy: (tabs, chartName, orgUnits) => chart_mcNfvQaVbfy_exportedDataBuilder(tabs, chartName, orgUnits),
    q5ldoFcgkSn: (tabs, chartName) => chart_q5ldoFcgkSn_or_ZxNdsDM8NSb_exportedDataBuilder(tabs, chartName),
    ZxNdsDM8NSb: (tabs, chartName) => chart_q5ldoFcgkSn_or_ZxNdsDM8NSb_exportedDataBuilder(tabs, chartName),
    pWFRTFfh5mA: (tabs, chartName) => chart_pWFRTFfh5mA_exportedDataBuilder(tabs, chartName),
    uRZCilOIr1C: (tabs, chartName) => chat_uRZCilOIr1C_exportedDataBuilder(tabs, chartName),
    cGE32OzPgMS: (tabs, chartName) => chart_cGE32OzPgMS_exportedDataBuilder(tabs, chartName),
    z6nPPMMbOw5: (tabs, chartName) => chart_z6nPPMMbOw5_exportedDataBuilder(tabs, chartName),
    fY7K8ATEDgQ: (tabs, chartName) => chat_fY7K8ATEDgQ_exportedDataBuilder(tabs, chartName),
};

// Exporters that read the `Indicator` column directly. Charts in this registry bypass the
// `Indicator` -> `Parameter` rename applied to `visualizationsExportedDataChartBuilder` entries.
export const customHeaderExportedDataChartBuilder: Record<string, ExportedDataChartBuilder> = {
    Y31jQX5PVdI: (tabs, chartName) => chart_Y31jQX5PVdI_exportedDataBuilder(tabs, chartName),
    TzWcDtEOTPX: (tabs, chartName) => chart_TzWcDtEOTPX_exportedDataBuilder(tabs, chartName),
    NOR4oxtMVxP: (tabs, chartName) => chart_NOR4oxtMVxP_exportedDataBuilder(tabs, chartName),
    Uf4B2PFIO6f_VQyARVycY60: (tabs, chartName) => chart_Uf4B2PFIO6f_VQyARVycY60_exportedDataBuilder(tabs, chartName),
    rT39aStYqI3: (tabs, chartName) => chart_rT39aStYqI3_exportedDataBuilder(tabs, chartName),
    nhaxK33nlhb: (tabs, chartName) => chart_nhaxK33nlhb_exportedDataBuilder(tabs, chartName),
    OB4SCQfCzwz: (tabs, chartName) => chart_OB4SCQfCzwz_exportedDataBuilder(tabs, chartName),
    sjgCABd3zK7: (tabs, chartName) => chart_sjgCABd3zK7_exportedDataBuilder(tabs, chartName),
    qipBCG0Hc9Y: (tabs, chartName) => chart_qipBCG0Hc9Y_exportedDataBuilder(tabs, chartName),
};
