import { Country } from "../../../../domain/entities/Country";
import { Analytics } from "../../../../domain/entities/indicator-explorer/Analytics";
import { Visualization } from "../../../../domain/entities/indicator-explorer/Visualization";
import { Id } from "../../../../domain/entities/Ref";
import { Region } from "../../../../domain/entities/region/Region";
import { chart_kIpnMBaBvZ9_Options } from "./chart_kIpnMBaBvZ9_Options";
import { chart_dbc87Ljw8uN_Options } from "./chart_dbc87Ljw8uN_Options";
import { chart_NOukqSxCI63_Options } from "./chart_NOukqSxCI63_Options";
import { chart_B4CnzUqVR3n_Options } from "./chart_B4CnzUqVR3n_Options";
import { chart_GimM6ANOKhd_Options } from "./chart_GimM6ANOKhd_Options";
import { chart_VB7bdJ8ZXya_Options } from "./chart_VB7bdJ8ZXya_Options";
import { chart_mcNfvQaVbfy_Options } from "./chart_mcNfvQaVbfy_Options";
import { chart_eEKRLRR4mDk_Options } from "./chart_eEKRLRR4mDk_Options";
import { chart_mUjcWO90CRr_Options } from "./chart_mUjcWO90CRr_Options";
import { chart_eibYs7QySNk_Options } from "./chart_eibYs7QySNk_Options";
import { chart_Uf4B2PFIO6f_VQyARVycY60_Options } from "./chart_Uf4B2PFIO6f_VQyARVycY60_Options";
import { chart_DefU3mkASo6_Options } from "./chart_DefU3mkASo6_Options";
import { chart_EtHaEt6bnm5_nlYSkEMZxgN_Options } from "./chart_EtHaEt6bnm5_nlYSkEMZxgN_Options";
import { chart_GNUHM5lQMTp_Options } from "./chart_GNUHM5lQMTp_Options";
import { chart_AophAEpx5e0_BOcLONPSyYS_Options } from "./chart_AophAEpx5e0_BOcLONPSyYS_Options";
import { chart_iMI82inOBiD_Options } from "./chart_iMI82inOBiD_Options";
import { chart_q5ldoFcgkSn_Options } from "./chart_q5ldoFcgkSn_Options";
import { chart_WDUV9ZrJiNC_Options } from "./chart_WDUV9ZrJiNC_Options";
import { chart_MfLZYD6QCPy_Options } from "./chart_MfLZYD6QCPy_Options";
import { chart_CdqVV1Ib0XS_Options } from "./chart_CdqVV1Ib0XS_Options";
import { chart_twyY1ulr7uD_Options } from "./chart_twyY1ulr7uD_Options";
import { chart_fnOIi0bdISn_Options } from "./chart_fnOIi0bdISn_Options";
import { chart_y4qAv6eW4nb_Options } from "./chart_y4qAv6eW4nb_Options";

export interface ChartSource {
    analyticsResponse: Analytics;
    visualization: Visualization;
    countries: Country[];
    regions: Region[];
    currentCountryOrRegion?: Id;
    currentYear?: string;
    isLatestCOVID19?: boolean;
    isLatestYearAvailable?: boolean;
    yearToFilterBy?: string;
    isRegionalPage?: boolean;
    seriesColors?: Record<string, string>;
    sharedYAxisConfig?: { isSharedMax: boolean };
    maxYearToFilterBy?: string;
}

export interface ChartSourceMultiple {
    analyticsResponse: Analytics[];
    visualization: Visualization[];
    countries: Country[];
    regions: Region[];
    currentCountryOrRegion?: Id;
    currentYear?: string;
    isLatestCOVID19?: boolean;
    isLatestYearAvailable?: boolean;
    yearToFilterBy?: string;
    isRegionalPage?: boolean;
    seriesColors?: Record<string, string>;
    sharedYAxisConfig?: { isSharedMax: boolean };
    maxYearToFilterBy?: string;
}

export const chartOptions: Record<string, (chartSource: ChartSource) => Highcharts.Options> = {
    kIpnMBaBvZ9: chartSource => chart_kIpnMBaBvZ9_Options(chartSource),
    dbc87Ljw8uN: chartSource => chart_dbc87Ljw8uN_Options(chartSource),
    NOukqSxCI63: chartSource => chart_NOukqSxCI63_Options(chartSource),
    B4CnzUqVR3n: chartSource => chart_B4CnzUqVR3n_Options(chartSource),
    iMI82inOBiD: chartSource => chart_iMI82inOBiD_Options(chartSource),
    GimM6ANOKhd: chartSource => chart_GimM6ANOKhd_Options(chartSource),
    VB7bdJ8ZXya: chartSource => chart_VB7bdJ8ZXya_Options(chartSource),
    q5ldoFcgkSn: chartSource => chart_q5ldoFcgkSn_Options(chartSource),
    mcNfvQaVbfy: chartSource => chart_mcNfvQaVbfy_Options(chartSource),
    eEKRLRR4mDk: chartSource => chart_eEKRLRR4mDk_Options(chartSource),
    mUjcWO90CRr: chartSource => chart_mUjcWO90CRr_Options(chartSource),
    fnOIi0bdISn: chartSource => chart_fnOIi0bdISn_Options(chartSource), // same as mUjcWO90CRr
    eibYs7QySNk: chartSource => chart_eibYs7QySNk_Options(chartSource),
    DefU3mkASo6: chartSource => chart_DefU3mkASo6_Options(chartSource),
    GNUHM5lQMTp: chartSource => chart_GNUHM5lQMTp_Options(chartSource),
    WDUV9ZrJiNC: chartSource => chart_WDUV9ZrJiNC_Options(chartSource),
    MfLZYD6QCPy: chartSource => chart_MfLZYD6QCPy_Options(chartSource),
    CdqVV1Ib0XS: chartSource => chart_CdqVV1Ib0XS_Options(chartSource),
    twyY1ulr7uD: chartSource => chart_twyY1ulr7uD_Options(chartSource),
    y4qAv6eW4nb: chartSource => chart_y4qAv6eW4nb_Options(chartSource),
};

export const chartOptionsMultiple: Record<string, (chartSource: ChartSourceMultiple) => Highcharts.Options> = {
    Uf4B2PFIO6f_VQyARVycY60: chartSource => chart_Uf4B2PFIO6f_VQyARVycY60_Options(chartSource),
    EtHaEt6bnm5_nlYSkEMZxgN: chartSource => chart_EtHaEt6bnm5_nlYSkEMZxgN_Options(chartSource),
    AophAEpx5e0_BOcLONPSyYS: chartSource => chart_AophAEpx5e0_BOcLONPSyYS_Options(chartSource),
};
