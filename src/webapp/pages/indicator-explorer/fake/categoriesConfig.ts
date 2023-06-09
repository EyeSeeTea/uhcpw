import chart_0 from "../../../assets/charts/0.png";
import chart_1_BUL from "../../../assets/charts/bulgaria/1.png";
import chart_1_BEL from "../../../assets/charts/belgium/1.png";
import chart_1_SPA from "../../../assets/charts/spain/1.png";
import chart_2 from "../../../assets/charts/2.png";
import chart_3_BUL from "../../../assets/charts/bulgaria/3.png";
import chart_3_BEL from "../../../assets/charts/belgium/3.png";
import chart_3_SPA from "../../../assets/charts/spain/3.png";
import chart_4 from "../../../assets/charts/4.png";
import chart_5_BUL from "../../../assets/charts/bulgaria/5.png";
import chart_5_BEL from "../../../assets/charts/belgium/5.png";
import chart_5_SPA from "../../../assets/charts/spain/5.png";
import chart_6 from "../../../assets/charts/6.png";
import chart_7_BUL from "../../../assets/charts/bulgaria/7.png";
import chart_7_BEL from "../../../assets/charts/belgium/7.png";
import chart_7_SPA from "../../../assets/charts/spain/7.png";
import chart_8_BUL from "../../../assets/charts/bulgaria/8.png";
import chart_8_BEL from "../../../assets/charts/belgium/8.png";
import chart_8_SPA from "../../../assets/charts/spain/8.png";
import chart_9 from "../../../assets/charts/9.png";
import chart_10_BUL from "../../../assets/charts/bulgaria/10.png";
import chart_10_BEL from "../../../assets/charts/belgium/10.png";
import chart_10_SPA from "../../../assets/charts/spain/10.png";
import chart_11_BUL from "../../../assets/charts/bulgaria/11.png";
import chart_11_BEL from "../../../assets/charts/belgium/11.png";
import chart_11_SPA from "../../../assets/charts/spain/11.png";
import chart_12_BUL from "../../../assets/charts/bulgaria/12.png";
import chart_12_BEL from "../../../assets/charts/belgium/12.png";
import chart_12_SPA from "../../../assets/charts/spain/12.png";
import chart_13_BUL from "../../../assets/charts/bulgaria/13.png";
import chart_13_BEL from "../../../assets/charts/belgium/13.png";
import chart_13_SPA from "../../../assets/charts/spain/13.png";
import chart_14_BUL from "../../../assets/charts/bulgaria/14.png";
import chart_14_BEL from "../../../assets/charts/belgium/14.png";
import chart_14_SPA from "../../../assets/charts/spain/14.png";
import chart_15_BUL from "../../../assets/charts/bulgaria/15.png";
import chart_15_BEL from "../../../assets/charts/belgium/15.png";
import chart_15_SPA from "../../../assets/charts/spain/15.png";
import chart_16 from "../../../assets/charts/16.png";
import chart_17_BUL from "../../../assets/charts/bulgaria/17.png";
import chart_17_BEL from "../../../assets/charts/belgium/17.png";
import chart_17_SPA from "../../../assets/charts/spain/17.png";

/**
 * ESP = DVnpk4xiXGJ
 * BUL = AjeCGGb8H76
 * BEL = KwgjnBBpe5b
 */

export type CategoryConfig = {
    metadata: { id: string; filterByCountry: boolean; chartName: string };
    data: ChartData[];
};

export type ChartData = {
    countryId?: string;
    image: string;
};
export const categoriesConfig: Record<string, CategoryConfig> = {
    "Comparative charts: Households with catastrophic health spending and out-of-pocket payments as a share of current spending on health, 2019 or latest available year before COVID-19":
        {
            metadata: {
                id: "0",
                filterByCountry: false,
                chartName:
                    "Households with catastrophic health spending and out-of-pocket payments as a share of current spending on health, 2019 or latest available year before COVID-19",
            },
            data: [
                {
                    countryId: "DVnpk4xiXGJ",
                    image: chart_0,
                },
            ],
        },

    "Comparative charts: Households with impoverishing health spending, 2019 or latest available year before COVID-19":
        {
            metadata: {
                id: "2",
                filterByCountry: false,
                chartName:
                    "Households with impoverishing health spending, 2019 or latest available year before COVID-19",
            },
            data: [
                {
                    countryId: "DVnpk4xiXGJ",
                    image: chart_2,
                },
            ],
        },
    "Comparative charts: Households with catastrophic health spending, 2019 or latest available year before COVID-19": {
        metadata: {
            id: "4",
            filterByCountry: false,
            chartName: "Households with catastrophic health spending, 2019 or latest available year before COVID-19",
        },
        data: [
            {
                countryId: "DVnpk4xiXGJ",
                image: chart_4,
            },
        ],
    },
    "Comparative charts: Households with catastrophic health spending by consumption quintile, 2019 or latest available year before COVID -19":
        {
            metadata: {
                id: "6",
                filterByCountry: false,
                chartName:
                    "Households with catastrophic health spending by consumption quintile, 2019 or latest available year before COVID -19",
            },
            data: [
                {
                    countryId: "DVnpk4xiXGJ",
                    image: chart_6,
                },
            ],
        },
    "Comparative charts: Breakdown of catastrophic health spending by type of care, 2019 or latest available year before COVID-19":
        {
            metadata: {
                id: "9",
                filterByCountry: false,
                chartName:
                    "Breakdown of catastrophic health spending by type of care, 2019 or latest available year before COVID-19",
            },
            data: [
                {
                    countryId: "DVnpk4xiXGJ",
                    image: chart_9,
                },
            ],
        },
    "Comparative charts: Public spending on health as a share of government spending, 2019": {
        metadata: {
            id: "16",
            filterByCountry: false,
            chartName: "Public spending on health as a share of government spending, 2019",
        },
        data: [
            {
                countryId: "DVnpk4xiXGJ",
                image: chart_16,
            },
        ],
    },
    "Financial Hardship: Households with catastrophic health spending": {
        metadata: {
            id: "3",
            filterByCountry: true,
            chartName: "Households with catastrophic health spending",
        },
        data: [
            {
                countryId: "DVnpk4xiXGJ",
                image: chart_3_SPA,
            },
            {
                countryId: "AjeCGGb8H76",
                image: chart_3_BUL,
            },
            {
                countryId: "KwgjnBBpe5b",
                image: chart_3_BEL,
            },
        ],
    },
    "Financial Hardship: Breakdown of catastrophic health spending by type of care": {
        metadata: {
            id: "7",
            filterByCountry: true,
            chartName: "Breakdown of catastrophic health spending by type of care",
        },
        data: [
            {
                countryId: "DVnpk4xiXGJ",
                image: chart_7_SPA,
            },
            {
                countryId: "AjeCGGb8H76",
                image: chart_7_BUL,
            },
            {
                countryId: "KwgjnBBpe5b",
                image: chart_7_BEL,
            },
        ],
    },
    "Financial Hardship: Households with catastrophic health spending by consumption quintile": {
        metadata: {
            id: "5",
            filterByCountry: true,
            chartName: "Households with catastrophic health spending by consumption quintile",
        },
        data: [
            {
                countryId: "DVnpk4xiXGJ",
                image: chart_5_SPA,
            },
            {
                countryId: "AjeCGGb8H76",
                image: chart_5_BUL,
            },
            {
                countryId: "KwgjnBBpe5b",
                image: chart_5_BEL,
            },
        ],
    },
    "Financial Hardship: Households with impoverishing health spending": {
        metadata: {
            id: "1",
            filterByCountry: true,
            chartName: "Households with impoverishing health spending",
        },
        data: [
            {
                countryId: "DVnpk4xiXGJ",
                image: chart_1_SPA,
            },
            {
                countryId: "AjeCGGb8H76",
                image: chart_1_BUL,
            },
            {
                countryId: "KwgjnBBpe5b",
                image: chart_1_BEL,
            },
        ],
    },
    "Financial Hardship: Breakdown of catastrophic health spending by type of care and consumption quintile": {
        metadata: {
            id: "8",
            filterByCountry: true,
            chartName: "Breakdown of catastrophic health spending by type of care and consumption quintile",
        },
        data: [
            {
                countryId: "DVnpk4xiXGJ",
                image: chart_8_SPA,
            },
            {
                countryId: "AjeCGGb8H76",
                image: chart_8_BUL,
            },
            {
                countryId: "KwgjnBBpe5b",
                image: chart_8_BEL,
            },
        ],
    },
    "Spending on health (health accounts): Current spending on health per person by financing scheme": {
        metadata: {
            id: "14",
            filterByCountry: true,
            chartName: "Current spending on health per person by financing scheme",
        },
        data: [
            {
                countryId: "DVnpk4xiXGJ",
                image: chart_14_SPA,
            },
            {
                countryId: "AjeCGGb8H76",
                image: chart_14_BUL,
            },
            {
                countryId: "KwgjnBBpe5b",
                image: chart_14_BEL,
            },
        ],
    },
    "Spending on health (health accounts): Out-of-pocket payments as a share of current spending on health": {
        metadata: {
            id: "15",
            filterByCountry: true,
            chartName: "Out-of-pocket payments as a share of current spending on health",
        },
        data: [
            {
                countryId: "DVnpk4xiXGJ",
                image: chart_15_SPA,
            },
            {
                countryId: "AjeCGGb8H76",
                image: chart_15_BUL,
            },
            {
                countryId: "KwgjnBBpe5b",
                image: chart_15_BEL,
            },
        ],
    },
    "Spending on health (health accounts): Public spending on health as a share of GDP": {
        metadata: {
            id: "17",
            filterByCountry: true,
            chartName: "Public spending on health as a share of GDP",
        },
        data: [
            {
                countryId: "DVnpk4xiXGJ",
                image: chart_17_SPA,
            },
            {
                countryId: "AjeCGGb8H76",
                image: chart_17_BUL,
            },
            {
                countryId: "KwgjnBBpe5b",
                image: chart_17_BEL,
            },
        ],
    },
    "Unmet need: Unmet need for health care due to cost, distance and waiting time": {
        metadata: {
            id: "10",
            filterByCountry: true,
            chartName: "Unmet need for health care due to cost, distance and waiting time",
        },
        data: [
            {
                countryId: "DVnpk4xiXGJ",
                image: chart_10_SPA,
            },
            {
                countryId: "AjeCGGb8H76",
                image: chart_10_BUL,
            },
            {
                countryId: "KwgjnBBpe5b",
                image: chart_10_BEL,
            },
        ],
    },
    "Unmet need: Unmet need for dental care due to cost, distance and waiting time": {
        metadata: {
            id: "11",
            filterByCountry: true,
            chartName: "Unmet need for dental care due to cost, distance and waiting time",
        },
        data: [
            {
                countryId: "DVnpk4xiXGJ",
                image: chart_11_SPA,
            },
            {
                countryId: "AjeCGGb8H76",
                image: chart_11_BUL,
            },
            {
                countryId: "KwgjnBBpe5b",
                image: chart_11_BEL,
            },
        ],
    },
    "Unmet need: Unmet need for health care due to cost, distance and waiting time by income quintile": {
        metadata: {
            id: "12",
            filterByCountry: true,
            chartName: "Unmet need for health care due to cost, distance and waiting time by income quintile",
        },
        data: [
            {
                countryId: "DVnpk4xiXGJ",
                image: chart_12_SPA,
            },
            {
                countryId: "AjeCGGb8H76",
                image: chart_12_BUL,
            },
            {
                countryId: "KwgjnBBpe5b",
                image: chart_12_BEL,
            },
        ],
    },
    "Unmet need: Unmet need for dental care due to cost, distance and waiting time by income quintile": {
        metadata: {
            id: "13",
            filterByCountry: true,
            chartName: "Unmet need for dental care due to cost, distance and waiting time by income quintile",
        },
        data: [
            {
                countryId: "DVnpk4xiXGJ",
                image: chart_13_SPA,
            },
            {
                countryId: "AjeCGGb8H76",
                image: chart_13_BUL,
            },
            {
                countryId: "KwgjnBBpe5b",
                image: chart_13_BEL,
            },
        ],
    },
};
