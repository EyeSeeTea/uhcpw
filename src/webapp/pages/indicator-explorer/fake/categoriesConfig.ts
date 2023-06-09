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
    metadata: {
        id: string;
        filterByCountry: boolean;
        chartName: string;
        dialogInfo: { title?: string; infoNotes: string[]; sourceName: string; sourceLink: string };
    };
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
                dialogInfo: {
                    infoNotes: [
                        "Data on catastrophic health spending and out-of-pocket payments are for the same year. The colour of the dots reflects the incidence of catastrophic health spending. Green < 5%; orange < 10%; red ≥ 10%. For catastrophic health spending, the Netherlands cannot be compared to other countries because the Dutch household budget survey does not count the annual deductible amount households pay out-of-pocket for covered health care as household spending on health; our simulations suggest that catastrophic health spending is underestimated by up to 1.8 percentage points in the Netherlands in 2015.",
                    ],
                    sourceName: "WHO Barcelona Office for Health Systems Financing",
                    sourceLink: "",
                },
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
                dialogInfo: {
                    infoNotes: [
                        "A household is impoverished if its total spending (consumption) is below the basic needs line after out-of-pocket payments (i.e. it can no longer afford to meet its basic needs) and further impoverished if its total spending is below the basic needs line (i.e. it is already unable to meet its basic needs) and it incurs out-of-pocket payments. The Netherlands cannot be compared to other countries because the Dutch household budget survey does not count the annual deductible amount households pay out-of-pocket for covered health care as household spending on health; our simulations suggest that catastrophic health spending is underestimated by up to 1.8 percentage points in the Netherlands in 2015.",
                    ],
                    sourceName: "WHO Barcelona Office for Health Systems Financing",
                    sourceLink: "",
                },
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
            dialogInfo: {
                infoNotes: [
                    "Catastrophic health spending refers to the share of households with out-of-pocket payments greater than 40% of household capacity to pay for health care. The Netherlands cannot be compared to other countries because the Dutch household budget survey does not count the annual deductible amount households pay out-of-pocket for covered health care as household spending on health; our simulations suggest that catastrophic health spending is underestimated by up to 1.8 percentage points in the Netherlands in 2015.",
                ],
                sourceName: "WHO Barcelona Office for Health Systems Financing",
                sourceLink: "",
            },
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
                dialogInfo: {
                    infoNotes: [
                        "Catastrophic health spending refers to the share of households with out-of-pocket payments greater than 40% of household capacity to pay for health care. Consumption quintiles are based on per person consumption using OECD equivalence scales. The Netherlands cannot be compared to other countries because the Dutch household budget survey does not count the annual deductible amount households pay out-of-pocket for covered health care as household spending on health; our simulations suggest that catastrophic health spending is underestimated by up to 1.8 percentage points in the Netherlands in 2015.",
                    ],
                    sourceName: "WHO Barcelona Office for Health Systems Financing",
                    sourceLink: "",
                },
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
                dialogInfo: {
                    infoNotes: [
                        "The different types of health care are sorted by the incidence of catastrophic health spending and the unweighted average across countries. Diagnostic tests include paramedical services. Medical products include non-medicine products and equipment (e.g. nebulizers, hearing aids, glasses and wheelchairs). In Spain dentures are classified as medical products in the household budget survey; in most other countries they are classified as dental care. In Ukraine the medicines category includes inpatient medicines; in most other countries the medicines category refers to outpatient medicines only. The Netherlands cannot be compared to other countries because the Dutch household budget survey does not count the annual deductible amount households pay out-of-pocket for covered health care as household spending on health; our simulations suggest that catastrophic health spending is underestimated by up to 1.8 percentage points in the Netherlands in 2015.",
                    ],
                    sourceName: "WHO Barcelona Office for Health Systems Financing",
                    sourceLink: "",
                },
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
            dialogInfo: {
                infoNotes: [
                    "Public refers to transfers from the government budget and social health insurance contributions; it excludes other forms of compulsory pre-payment. It excludes San Marino.  EU average include the United Kingdom up to and including 2019.",
                ],
                sourceName: "WHO Global Health Expenditure Database",
                sourceLink: "",
            },
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
            dialogInfo: {
                infoNotes: [
                    "Catastrophic health spending refers to the share of households with out-of-pocket payments greater than 40% of household capacity to pay for health care.",
                ],
                sourceName: "WHO Barcelona Office for Health Systems Financing",
                sourceLink: "",
            },
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
            dialogInfo: {
                infoNotes: [
                    "Diagnostic tests include paramedical services. Medical products include non-medicine products and equipment (e.g. nebulizers, hearing aids, glasses and wheelchairs).",
                ],
                sourceName: "WHO Barcelona Office for Health Systems Financing",
                sourceLink: "",
            },
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
            dialogInfo: {
                infoNotes: [
                    "Catastrophic health spending refers to the share of households with out-of-pocket payments greater than 40% of household capacity to pay for health care. Consumption quintiles are based on per person consumption using OECD equivalence scales.",
                ],
                sourceName: "WHO Barcelona Office for Health Systems Financing",
                sourceLink: "",
            },
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
            dialogInfo: {
                infoNotes: [
                    "A household is impoverished if its total spending (consumption) is below the basic needs line after out-of-pocket payments (i.e. it can no longer afford to meet its basic needs) and further impoverished if its total spending is below the basic needs line (i.e. it is already unable to meet its basic needs) and it incurs out-of-pocket payments.",
                ],
                sourceName: "WHO Barcelona Office for Health Systems Financing",
                sourceLink: "",
            },
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
            dialogInfo: {
                infoNotes: [
                    "Diagnostic tests include paramedical services. Medical products include non-medicine products and equipment (e.g. nebulizers, hearing aids, glasses and wheelchairs). Consumption quintiles are based on per person consumption using OECD equivalence scales.",
                ],
                sourceName: "WHO Barcelona Office for Health Systems Financing",
                sourceLink: "",
            },
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
            dialogInfo: {
                infoNotes: [
                    "Public refers to transfers from the government budget and social health insurance contributions; it excludes other forms of compulsory pre-payment.",
                ],
                sourceName: "WHO Global Health Expenditure Database",
                sourceLink: "",
            },
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
            dialogInfo: {
                infoNotes: ["EU average include the United Kingdom up to and including 2019."],
                sourceName: "WHO Global Health Expenditure Database",
                sourceLink: "",
            },
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
            dialogInfo: {
                infoNotes: [
                    "Public refers to transfers from the government budget and social health insurance contributions; it excludes other forms of compulsory pre-payment. EU average include the United Kingdom up to and including 2019.",
                ],
                sourceName: "WHO Global Health Expenditure Database",
                sourceLink: "",
            },
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
            dialogInfo: {
                infoNotes: [
                    "Health care refers to ‘medical examination or treatment’. Break in series for Belgium in 2011 and 2019",
                ],
                sourceName: "Eurostat (European Union Statistics on Income and Living Conditions)",
                sourceLink: "",
            },
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
            dialogInfo: {
                title: "Info:",
                infoNotes: [
                    "Dental care refers to ‘dental examination or treatment’. Break in series for Belgium in 2011 and 2019.",
                ],
                sourceName: "Eurostat (European Union Statistics on Income and Living Conditions)",
                sourceLink: "",
            },
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
            dialogInfo: {
                infoNotes: [
                    "Income quintiles are based on the equivalized disposable income of each household member. Break in series in 2011 and 2019.",
                ],
                sourceName: "Eurostat (European Union Statistics on Income and Living Conditions)",
                sourceLink: "",
            },
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
            dialogInfo: {
                infoNotes: [
                    "Income quintiles are based on the equivalized disposable income of each household member. Break in series in 2011 and 2019.",
                ],
                sourceName: "Eurostat (European Union Statistics on Income and Living Conditions)",
                sourceLink: "",
            },
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
