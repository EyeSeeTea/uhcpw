import { Country } from "../../../../domain/entities/Country";
import { Analytics } from "../../../../domain/entities/indicator-explorer/Analytics";
import { Visualization } from "../../../../domain/entities/indicator-explorer/Visualization";
import { chart_hNU4Lj1xLYO_Options } from "./chart_hNU4Lj1xLYO_Options";
import { chart_dbc87Ljw8uN_Options } from "./chart_dbc87Ljw8uN_Options";
import { chart_NOukqSxCI63_Options } from "./chart_NOukqSxCI63_Options";
import { chart_B4CnzUqVR3n_Options } from "./chart_B4CnzUqVR3n_Options";
import { chart_GimM6ANOKhd_Options } from "./chart_GimM6ANOKhd_Options";
import { chart_VB7bdJ8ZXya_Options } from "./chart_VB7bdJ8ZXya_Options";
import { chart_mcNfvQaVbfy_Options } from "./chart_mcNfvQaVbfy_Options";
import { chart_eEKRLRR4mDk_Options } from "./chart_eEKRLRR4mDk_Options";
import { chart_mUjcWO90CRr_Options } from "./chart_mUjcWO90CRr_Options";

export interface ChartSource {
    analyticsResponse: Analytics;
    visualization: Visualization;
    countries: Country[];
    currentCountry?: string;
}

export const chartOptions: Record<string, (chartSource: ChartSource) => Highcharts.Options> = {
    hNU4Lj1xLYO: chartSource => chart_hNU4Lj1xLYO_Options(chartSource),
    dbc87Ljw8uN: chartSource => chart_dbc87Ljw8uN_Options(chartSource),
    NOukqSxCI63: chartSource => chart_NOukqSxCI63_Options(chartSource),
    B4CnzUqVR3n: chartSource => chart_B4CnzUqVR3n_Options(chartSource),
    GimM6ANOKhd: chartSource => chart_GimM6ANOKhd_Options(chartSource),
    VB7bdJ8ZXya: chartSource => chart_VB7bdJ8ZXya_Options(chartSource),
    mcNfvQaVbfy: chartSource => chart_mcNfvQaVbfy_Options(chartSource),
    eEKRLRR4mDk: chartSource => chart_eEKRLRR4mDk_Options(chartSource),
    mUjcWO90CRr: chartSource => chart_mUjcWO90CRr_Options(chartSource),
};
