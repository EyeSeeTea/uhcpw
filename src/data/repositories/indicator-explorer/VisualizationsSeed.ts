import { VisualizationExtra } from "../../../domain/entities/indicator-explorer/Visualization";

export const emptyVisualizationExtra = {
    categoryName: "",
    friendlyName: "",
    info: {
        infoNotes: [],
        sourceName: "",
        sourceLink: "",
    },
};

export const visualizationsSeed: Record<string, VisualizationExtra> = {
    Y31jQX5PVdI: {
        categoryName: "Financial Hardship",
        friendlyName: "Households with catastrophic health spending",
        info: {
            infoNotes: [
                "Catastrophic health spending refers to the share of households with out-of-pocket payments greater than 40% of household capacity to pay for health care.",
            ],
            sourceName: "WHO Barcelona Office for Health Systems Financing",
            sourceLink: "",
        },
        maxCountryFilter: 1,
    },
    ZxNdsDM8NSb: {
        categoryName: "Financial Hardship",
        friendlyName: "Breakdown of catastrophic health spending by type of care and consumption quintile",
        info: {
            infoNotes: [
                "Analysis as of 2020. Diagnostic tests include paramedical services. Medical products include non-medicine products and equipment (e.g. nebulizers, hearing aids, glasses and wheelchairs). Consumption quintiles are based on per person",
            ],
            sourceName: "",
            sourceLink: "",
        },
        maxCountryFilter: 1,
    },
    zkEtsohZTTf: {
        categoryName: "Unmet need",
        friendlyName: "Unmet need for dental care due to cost, distance and waiting time",
        info: {
            infoNotes: ["Dental care refers to ‘dental examination or treatment"],
            sourceName: "Eurostat (European Union Statistics on Income and Living Conditions)",
            sourceLink: "",
        },
        minCountryFilter: 2,
    },
    ZZAcIv6O9LY: {
        categoryName: "Health Spending (Health accounts)",
        friendlyName: "Public spending on health as a share of current spending on health",
        info: {
            infoNotes: [],
            sourceName: "",
            sourceLink: "",
        },
        minCountryFilter: 2,
    },
    rT39aStYqI3: {
        categoryName: "Unmet need",
        friendlyName: "Unmet need for health care due to cost, distance and waiting time by income quintile",
        info: {
            infoNotes: ["Income quintiles are based on the equivalized disposable income of each household member."],
            sourceName: "Eurostat (European Union Statistics on Income and Living Conditions)",
            sourceLink: "",
        },
        maxCountryFilter: 1,
    },
    nhaxK33nlhb: {
        categoryName: "Unmet need",
        friendlyName: "Unmet need for dental care due to cost, distance and waiting time by income quintile",
        info: {
            infoNotes: ["Income quintiles are based on the equivalized disposable income of each household member."],
            sourceName: "Eurostat (European Union Statistics on Income and Living Conditions)",
            sourceLink: "",
        },
        maxCountryFilter: 1,
    },
    BYAT5Woc9EJ: {
        categoryName: "Health Spending (Health accounts)",
        friendlyName: "Public spending on health as a share of GDP",
        info: {
            infoNotes: [
                "Public refers to transfers from the government budget and social health insurance contributions; it excludes other forms of compulsory pre-payment. EU average include the United Kingdom up to and including 2019.",
            ],
            sourceName: "WHO Global Health Expenditure Database",
            sourceLink: "",
        },
        minCountryFilter: 2,
    },
    d3kq9OCv8tH: {
        categoryName: "Health Spending (Health accounts)",
        friendlyName: "Out-of-pocket payments as a share of current spending on health",
        info: {
            infoNotes: ["EU average include the United Kingdom up to and including 2019."],
            sourceName: "WHO Global Health Expenditure Database",
            sourceLink: "",
        },
        minCountryFilter: 2,
    },
    jFtGKQIQTGp: {
        categoryName: "Financial hardship",
        friendlyName: "Households with impoverishing health spending",
        info: {
            infoNotes: [
                "A household is impoverished if its total spending (consumption) is below the basic needs line after out-of-pocket payments (i.e. it can no longer afford to meet its basic needs) and further impoverished if its total spending is below the basic needs line (i.e. it is already unable to meet its basic needs) and it incurs out-of-pocket payments.",
            ],
            sourceName: "WHO Barcelona Office for Health Systems Financing",
            sourceLink: "",
        },
        maxCountryFilter: 1,
    },
    geNXcoXc3mf: {
        categoryName: "Financial hardship",
        friendlyName: "Households with catastrophic health spending by consumption quintile",
        info: {
            infoNotes: [
                "Catastrophic health spending refers to the share of households with out-of-pocket payments greater than 40% of household capacity to pay for health care. Consumption quintiles are based on per person consumption using OECD equivalence scales.",
            ],
            sourceName: "WHO Barcelona Office for Health Systems Financing",
            sourceLink: "",
        },
        maxCountryFilter: 1,
    },
    // NU4Q0sIIvcG: {
    //     categoryName: "Financial Hardship",
    //     info: {
    //         infoNotes: [
    //             "Catastrophic health spending refers to the share of households with out-of-pocket payments greater than 40% of household capacity to pay for health care.",
    //         ],
    //         sourceName: "WHO Barcelona Office for Health Systems Financing",
    //         sourceLink: "",
    //     },
    // },
};

// export const categoriesConfig: Record<string, CategoryConfig> = {
//     "Comparative charts: Households with catastrophic health spending and out-of-pocket payments as a share of current spending on health, 2019 or latest available year before COVID-19":
//         {
//             metadata: {
//                 id: "0",
//                 filterByCountry: false,
//                 chartName:
//                     "Households with catastrophic health spending and out-of-pocket payments as a share of current spending on health, 2019 or latest available year before COVID-19",
//             },
//             data: [
//                 {
//                     countryId: "DVnpk4xiXGJ",
//                     image: chart_0,
//                     dialogInfo: {
//                         infoNotes: [
//                             "Data on catastrophic health spending and out-of-pocket payments are for the same year. The colour of the dots reflects the incidence of catastrophic health spending. Green < 5%; orange < 10%; red ≥ 10%. For catastrophic health spending, the Netherlands cannot be compared to other countries because the Dutch household budget survey does not count the annual deductible amount households pay out-of-pocket for covered health care as household spending on health; our simulations suggest that catastrophic health spending is underestimated by up to 1.8 percentage points in the Netherlands in 2015.",
//                         ],
//                         sourceName: "WHO Barcelona Office for Health Systems Financing",
//                         sourceLink: "",
//                     },
//                 },
//             ],
//         },

//     "Comparative charts: Households with impoverishing health spending, 2019 or latest available year before COVID-19":
//         {
//             metadata: {
//                 id: "2",
//                 filterByCountry: false,
//                 chartName:
//                     "Households with impoverishing health spending, 2019 or latest available year before COVID-19",
//             },
//             data: [
//                 {
//                     countryId: "DVnpk4xiXGJ",
//                     image: chart_2,
//                     dialogInfo: {
//                         infoNotes: [
//                             "A household is impoverished if its total spending (consumption) is below the basic needs line after out-of-pocket payments (i.e. it can no longer afford to meet its basic needs) and further impoverished if its total spending is below the basic needs line (i.e. it is already unable to meet its basic needs) and it incurs out-of-pocket payments. The Netherlands cannot be compared to other countries because the Dutch household budget survey does not count the annual deductible amount households pay out-of-pocket for covered health care as household spending on health; our simulations suggest that catastrophic health spending is underestimated by up to 1.8 percentage points in the Netherlands in 2015.",
//                         ],
//                         sourceName: "WHO Barcelona Office for Health Systems Financing",
//                         sourceLink: "",
//                     },
//                 },
//             ],
//         },
//     "Comparative charts: Households with catastrophic health spending, 2019 or latest available year before COVID-19": {
//         metadata: {
//             id: "4",
//             filterByCountry: false,
//             chartName: "Households with catastrophic health spending, 2019 or latest available year before COVID-19",
//         },
//         data: [
//             {
//                 countryId: "DVnpk4xiXGJ",
//                 image: chart_4,
//                 dialogInfo: {
//                     infoNotes: [
//                         "Catastrophic health spending refers to the share of households with out-of-pocket payments greater than 40% of household capacity to pay for health care. The Netherlands cannot be compared to other countries because the Dutch household budget survey does not count the annual deductible amount households pay out-of-pocket for covered health care as household spending on health; our simulations suggest that catastrophic health spending is underestimated by up to 1.8 percentage points in the Netherlands in 2015.",
//                     ],
//                     sourceName: "WHO Barcelona Office for Health Systems Financing",
//                     sourceLink: "",
//                 },
//             },
//         ],
//     },
//     "Comparative charts: Households with catastrophic health spending by consumption quintile, 2019 or latest available year before COVID -19":
//         {
//             metadata: {
//                 id: "6",
//                 filterByCountry: false,
//                 chartName:
//                     "Households with catastrophic health spending by consumption quintile, 2019 or latest available year before COVID -19",
//             },
//             data: [
//                 {
//                     countryId: "DVnpk4xiXGJ",
//                     image: chart_6,
//                     dialogInfo: {
//                         infoNotes: [
//                             "Catastrophic health spending refers to the share of households with out-of-pocket payments greater than 40% of household capacity to pay for health care. Consumption quintiles are based on per person consumption using OECD equivalence scales. The Netherlands cannot be compared to other countries because the Dutch household budget survey does not count the annual deductible amount households pay out-of-pocket for covered health care as household spending on health; our simulations suggest that catastrophic health spending is underestimated by up to 1.8 percentage points in the Netherlands in 2015.",
//                         ],
//                         sourceName: "WHO Barcelona Office for Health Systems Financing",
//                         sourceLink: "",
//                     },
//                 },
//             ],
//         },
//     "Comparative charts: Breakdown of catastrophic health spending by type of care, 2019 or latest available year before COVID-19":
//         {
//             metadata: {
//                 id: "9",
//                 filterByCountry: false,
//                 chartName:
//                     "Breakdown of catastrophic health spending by type of care, 2019 or latest available year before COVID-19",
//             },
//             data: [
//                 {
//                     countryId: "DVnpk4xiXGJ",
//                     image: chart_9,
//                     dialogInfo: {
//                         infoNotes: [
//                             "The different types of health care are sorted by the incidence of catastrophic health spending and the unweighted average across countries. Diagnostic tests include paramedical services. Medical products include non-medicine products and equipment (e.g. nebulizers, hearing aids, glasses and wheelchairs). In Spain dentures are classified as medical products in the household budget survey; in most other countries they are classified as dental care. In Ukraine the medicines category includes inpatient medicines; in most other countries the medicines category refers to outpatient medicines only. The Netherlands cannot be compared to other countries because the Dutch household budget survey does not count the annual deductible amount households pay out-of-pocket for covered health care as household spending on health; our simulations suggest that catastrophic health spending is underestimated by up to 1.8 percentage points in the Netherlands in 2015.",
//                         ],
//                         sourceName: "WHO Barcelona Office for Health Systems Financing",
//                         sourceLink: "",
//                     },
//                 },
//             ],
//         },
//     "Comparative charts: Public spending on health as a share of government spending, 2019": {
//         metadata: {
//             id: "16",
//             filterByCountry: false,
//             chartName: "Public spending on health as a share of government spending, 2019",
//         },
//         data: [
//             {
//                 countryId: "DVnpk4xiXGJ",
//                 image: chart_16,
//                 dialogInfo: {
//                     infoNotes: [
//                         "Public refers to transfers from the government budget and social health insurance contributions; it excludes other forms of compulsory pre-payment. It excludes San Marino.  EU average include the United Kingdom up to and including 2019.",
//                     ],
//                     sourceName: "WHO Global Health Expenditure Database",
//                     sourceLink: "",
//                 },
//             },
//         ],
//     },
//     "Financial Hardship: Households with catastrophic health spending": {
//         metadata: {
//             id: "3",
//             filterByCountry: true,
//             chartName: "Households with catastrophic health spending",
//         },
//         data: [
//             {
//                 countryId: "DVnpk4xiXGJ",
//                 image: chart_3_SPA,
//                 dialogInfo: {
//                     infoNotes: [
//                         "Catastrophic health spending refers to the share of households with out-of-pocket payments greater than 40% of household capacity to pay for health care.",
//                     ],
//                     sourceName: "WHO Barcelona Office for Health Systems Financing",
//                     sourceLink: "",
//                 },
//             },
//             {
//                 countryId: "AjeCGGb8H76",
//                 image: chart_3_BUL,
//                 dialogInfo: {
//                     infoNotes: [
//                         "Catastrophic health spending refers to the share of households with out-of-pocket payments greater than 40% of household capacity to pay for health care.",
//                     ],
//                     sourceName: "WHO Barcelona Office for Health Systems Financing",
//                     sourceLink: "",
//                 },
//             },
//             {
//                 countryId: "KwgjnBBpe5b",
//                 image: chart_3_BEL,
//                 dialogInfo: {
//                     infoNotes: [
//                         "Catastrophic health spending refers to the share of households with out-of-pocket payments greater than 40% of household capacity to pay for health care.  Break in series in 2018.",
//                     ],
//                     sourceName: "WHO Barcelona Office for Health Systems Financing",
//                     sourceLink: "",
//                 },
//             },
//         ],
//     },
//     "Financial Hardship: Breakdown of catastrophic health spending by type of care": {
//         metadata: {
//             id: "7",
//             filterByCountry: true,
//             chartName: "Breakdown of catastrophic health spending by type of care",
//         },
//         data: [
//             {
//                 countryId: "DVnpk4xiXGJ",
//                 image: chart_7_SPA,
//                 dialogInfo: {
//                     infoNotes: [
//                         "Diagnostic tests include paramedical services. Medical products include non-medicine products and equipment (e.g. nebulizers, hearing aids, glasses and wheelchairs).",
//                     ],
//                     sourceName: "WHO Barcelona Office for Health Systems Financing",
//                     sourceLink: "",
//                 },
//             },
//             {
//                 countryId: "AjeCGGb8H76",
//                 image: chart_7_BUL,
//                 dialogInfo: {
//                     infoNotes: [
//                         "Diagnostic tests include paramedical services. Medical products include non-medicine products and equipment (e.g. nebulizers, hearing aids, glasses and wheelchairs).",
//                     ],
//                     sourceName: "WHO Barcelona Office for Health Systems Financing",
//                     sourceLink: "",
//                 },
//             },
//             {
//                 countryId: "KwgjnBBpe5b",
//                 image: chart_7_BEL,
//                 dialogInfo: {
//                     infoNotes: [
//                         "Diagnostic tests include paramedical services. Medical products include non-medicine products and equipment (e.g. nebulizers, hearing aids, glasses and wheelchairs). Break in series in 2018.",
//                     ],
//                     sourceName: "WHO Barcelona Office for Health Systems Financing",
//                     sourceLink: "",
//                 },
//             },
//         ],
//     },
//     "Financial Hardship: Households with catastrophic health spending by consumption quintile": {
//         metadata: {
//             id: "5",
//             filterByCountry: true,
//             chartName: "Households with catastrophic health spending by consumption quintile",
//         },
//         data: [
//             {
//                 countryId: "DVnpk4xiXGJ",
//                 image: chart_5_SPA,
//                 dialogInfo: {
//                     infoNotes: [
//                         "Catastrophic health spending refers to the share of households with out-of-pocket payments greater than 40% of household capacity to pay for health care. Consumption quintiles are based on per person consumption using OECD equivalence scales.",
//                     ],
//                     sourceName: "WHO Barcelona Office for Health Systems Financing",
//                     sourceLink: "",
//                 },
//             },
//             {
//                 countryId: "AjeCGGb8H76",
//                 image: chart_5_BUL,
//                 dialogInfo: {
//                     infoNotes: [
//                         "Catastrophic health spending refers to the share of households with out-of-pocket payments greater than 40% of household capacity to pay for health care. Consumption quintiles are based on per person consumption using OECD equivalence scales.",
//                     ],
//                     sourceName: "WHO Barcelona Office for Health Systems Financing",
//                     sourceLink: "",
//                 },
//             },
//             {
//                 countryId: "KwgjnBBpe5b",
//                 image: chart_5_BEL,
//                 dialogInfo: {
//                     infoNotes: [
//                         "Catastrophic health spending refers to the share of households with out-of-pocket payments greater than 40% of household capacity to pay for health care. Consumption quintiles are based on per person consumption using OECD equivalence scales. Break in series in 2018.",
//                     ],
//                     sourceName: "WHO Barcelona Office for Health Systems Financing",
//                     sourceLink: "",
//                 },
//             },
//         ],
//     },
//     "Financial Hardship: Households with impoverishing health spending": {
//         metadata: {
//             id: "1",
//             filterByCountry: true,
//             chartName: "Households with impoverishing health spending",
//         },
//         data: [
//             {
//                 countryId: "DVnpk4xiXGJ",
//                 image: chart_1_SPA,
//                 dialogInfo: {
//                     infoNotes: [
//                         "A household is impoverished if its total spending (consumption) is below the basic needs line after out-of-pocket payments (i.e. it can no longer afford to meet its basic needs) and further impoverished if its total spending is below the basic needs line (i.e. it is already unable to meet its basic needs) and it incurs out-of-pocket payments.",
//                     ],
//                     sourceName: "WHO Barcelona Office for Health Systems Financing",
//                     sourceLink: "",
//                 },
//             },
//             {
//                 countryId: "AjeCGGb8H76",
//                 image: chart_1_BUL,
//                 dialogInfo: {
//                     infoNotes: [
//                         "A household is impoverished if its total spending (consumption) is below the basic needs line after out-of-pocket payments (i.e. it can no longer afford to meet its basic needs) and further impoverished if its total spending is below the basic needs line (i.e. it is already unable to meet its basic needs) and it incurs out-of-pocket payments.",
//                     ],
//                     sourceName: "WHO Barcelona Office for Health Systems Financing",
//                     sourceLink: "",
//                 },
//             },
//             {
//                 countryId: "KwgjnBBpe5b",
//                 image: chart_1_BEL,
//                 dialogInfo: {
//                     infoNotes: [
//                         "A household is impoverished if its total spending (consumption) is below the basic needs line after out-of-pocket payments (i.e. it can no longer afford to meet its basic needs) and further impoverished if its total spending is below the basic needs line (i.e. it is already unable to meet its basic needs) and it incurs out-of-pocket payments. Break in series in 2018.",
//                     ],
//                     sourceName: "WHO Barcelona Office for Health Systems Financing",
//                     sourceLink: "",
//                 },
//             },
//         ],
//     },
//     "Financial Hardship: Breakdown of catastrophic health spending by type of care and consumption quintile": {
//         metadata: {
//             id: "8",
//             filterByCountry: true,
//             chartName: "Breakdown of catastrophic health spending by type of care and consumption quintile",
//         },
//         data: [
//             {
//                 countryId: "DVnpk4xiXGJ",
//                 image: chart_8_SPA,
//                 dialogInfo: {
//                     infoNotes: [
//                         "Analysis as of 2020. Diagnostic tests include paramedical services. Medical products include non-medicine products and equipment (e.g. nebulizers, hearing aids, glasses and wheelchairs). Consumption quintiles are based on per person consumption using OECD equivalence scales.",
//                     ],
//                     sourceName: "WHO Barcelona Office for Health Systems Financing",
//                     sourceLink: "",
//                 },
//             },
//             {
//                 countryId: "AjeCGGb8H76",
//                 image: chart_8_BUL,
//                 dialogInfo: {
//                     infoNotes: [
//                         "Analysis as of 2018. Diagnostic tests include paramedical services. Medical products include non-medicine products and equipment (e.g. nebulizers, hearing aids, glasses and wheelchairs). Consumption quintiles are based on per person consumption using OECD equivalence scales.",
//                     ],
//                     sourceName: "WHO Barcelona Office for Health Systems Financing",
//                     sourceLink: "",
//                 },
//             },
//             {
//                 countryId: "KwgjnBBpe5b",
//                 image: chart_8_BEL,
//                 dialogInfo: {
//                     infoNotes: [
//                         "Analysis as of 2020. Diagnostic tests include paramedical services. Medical products include non-medicine products and equipment (e.g. nebulizers, hearing aids, glasses and wheelchairs). Consumption quintiles are based on per person consumption using OECD equivalence scales.",
//                     ],
//                     sourceName: "WHO Barcelona Office for Health Systems Financing",
//                     sourceLink: "",
//                 },
//             },
//         ],
//     },
//     "Spending on health (health accounts): Current spending on health per person by financing scheme": {
//         metadata: {
//             id: "14",
//             filterByCountry: true,
//             chartName: "Current spending on health per person by financing scheme",
//         },
//         data: [
//             {
//                 countryId: "DVnpk4xiXGJ",
//                 image: chart_14_SPA,
//                 dialogInfo: {
//                     infoNotes: [
//                         "Public refers to transfers from the government budget and social health insurance contributions; it excludes other forms of compulsory pre-payment.",
//                     ],
//                     sourceName: "WHO Global Health Expenditure Database",
//                     sourceLink: "",
//                 },
//             },
//             {
//                 countryId: "AjeCGGb8H76",
//                 image: chart_14_BUL,
//                 dialogInfo: {
//                     infoNotes: [
//                         "Public refers to transfers from the government budget and social health insurance contributions; it excludes other forms of compulsory pre-payment.",
//                     ],
//                     sourceName: "WHO Global Health Expenditure Database",
//                     sourceLink: "",
//                 },
//             },
//             {
//                 countryId: "KwgjnBBpe5b",
//                 image: chart_14_BEL,
//                 dialogInfo: {
//                     infoNotes: [
//                         "Public refers to transfers from the government budget and social health insurance contributions; it excludes other forms of compulsory pre-payment.",
//                     ],
//                     sourceName: "WHO Global Health Expenditure Database",
//                     sourceLink: "",
//                 },
//             },
//         ],
//     },
//     "Spending on health (health accounts): Out-of-pocket payments as a share of current spending on health": {
//         metadata: {
//             id: "15",
//             filterByCountry: true,
//             chartName: "Out-of-pocket payments as a share of current spending on health",
//         },

//         data: [
//             {
//                 countryId: "DVnpk4xiXGJ",
//                 image: chart_15_SPA,
//                 dialogInfo: {
//                     infoNotes: ["EU average include the United Kingdom up to and including 2019."],
//                     sourceName: "WHO Global Health Expenditure Database",
//                     sourceLink: "",
//                 },
//             },
//             {
//                 countryId: "AjeCGGb8H76",
//                 image: chart_15_BUL,
//                 dialogInfo: {
//                     infoNotes: ["EU average include the United Kingdom up to and including 2019."],
//                     sourceName: "WHO Global Health Expenditure Database",
//                     sourceLink: "",
//                 },
//             },
//             {
//                 countryId: "KwgjnBBpe5b",
//                 image: chart_15_BEL,
//                 dialogInfo: {
//                     infoNotes: ["EU average include the United Kingdom up to and including 2019."],
//                     sourceName: "WHO Global Health Expenditure Database",
//                     sourceLink: "",
//                 },
//             },
//         ],
//     },
//     "Spending on health (health accounts): Public spending on health as a share of GDP": {
//         metadata: {
//             id: "17",
//             filterByCountry: true,
//             chartName: "Public spending on health as a share of GDP",
//         },
//         data: [
//             {
//                 countryId: "DVnpk4xiXGJ",
//                 image: chart_17_SPA,
//                 dialogInfo: {
//                     infoNotes: [
//                         "Public refers to transfers from the government budget and social health insurance contributions; it excludes other forms of compulsory pre-payment. EU average include the United Kingdom up to and including 2019.",
//                     ],
//                     sourceName: "WHO Global Health Expenditure Database",
//                     sourceLink: "",
//                 },
//             },
//             {
//                 countryId: "AjeCGGb8H76",
//                 image: chart_17_BUL,
//                 dialogInfo: {
//                     infoNotes: [
//                         "Public refers to transfers from the government budget and social health insurance contributions; it excludes other forms of compulsory pre-payment. EU average include the United Kingdom up to and including 2019.",
//                     ],
//                     sourceName: "WHO Global Health Expenditure Database",
//                     sourceLink: "",
//                 },
//             },
//             {
//                 countryId: "KwgjnBBpe5b",
//                 image: chart_17_BEL,
//                 dialogInfo: {
//                     infoNotes: [
//                         "Public refers to transfers from the government budget and social health insurance contributions; it excludes other forms of compulsory pre-payment. EU average include the United Kingdom up to and including 2019.",
//                     ],
//                     sourceName: "WHO Global Health Expenditure Database",
//                     sourceLink: "",
//                 },
//             },
//         ],
//     },
//     "Unmet need: Unmet need for health care due to cost, distance and waiting time": {
//         metadata: {
//             id: "10",
//             filterByCountry: true,
//             chartName: "Unmet need for health care due to cost, distance and waiting time",
//         },
//         data: [
//             {
//                 countryId: "DVnpk4xiXGJ",
//                 image: chart_10_SPA,
//                 dialogInfo: {
//                     infoNotes: ["Health care refers to ‘medical examination or treatment’."],
//                     sourceName: "Eurostat (European Union Statistics on Income and Living Conditions)",
//                     sourceLink: "",
//                 },
//             },
//             {
//                 countryId: "AjeCGGb8H76",
//                 image: chart_10_BUL,
//                 dialogInfo: {
//                     infoNotes: ["Health care refers to ‘medical examination or treatment’."],
//                     sourceName: "Eurostat (European Union Statistics on Income and Living Conditions)",
//                     sourceLink: "",
//                 },
//             },
//             {
//                 countryId: "KwgjnBBpe5b",
//                 image: chart_10_BEL,
//                 dialogInfo: {
//                     infoNotes: [
//                         "Health care refers to ‘medical examination or treatment’. Break in series for Belgium in 2011 and 2019.",
//                     ],
//                     sourceName: "Eurostat (European Union Statistics on Income and Living Conditions)",
//                     sourceLink: "",
//                 },
//             },
//         ],
//     },
//     "Unmet need: Unmet need for dental care due to cost, distance and waiting time": {
//         metadata: {
//             id: "11",
//             filterByCountry: true,
//             chartName: "Unmet need for dental care due to cost, distance and waiting time",
//         },
//         data: [
//             {
//                 countryId: "DVnpk4xiXGJ",
//                 image: chart_11_SPA,
//                 dialogInfo: {
//                     title: "Info:",
//                     infoNotes: ["Dental care refers to ‘dental examination or treatment’."],
//                     sourceName: "Eurostat (European Union Statistics on Income and Living Conditions)",
//                     sourceLink: "",
//                 },
//             },
//             {
//                 countryId: "AjeCGGb8H76",
//                 image: chart_11_BUL,
//                 dialogInfo: {
//                     title: "Info:",
//                     infoNotes: ["Dental care refers to ‘dental examination or treatment’."],
//                     sourceName: "Eurostat (European Union Statistics on Income and Living Conditions)",
//                     sourceLink: "",
//                 },
//             },
//             {
//                 countryId: "KwgjnBBpe5b",
//                 image: chart_11_BEL,
//                 dialogInfo: {
//                     title: "Info:",
//                     infoNotes: [
//                         "Dental care refers to ‘dental examination or treatment’. Break in series for Belgium in 2011 and 2019.",
//                     ],
//                     sourceName: "Eurostat (European Union Statistics on Income and Living Conditions)",
//                     sourceLink: "",
//                 },
//             },
//         ],
//     },
//     "Unmet need: Unmet need for health care due to cost, distance and waiting time by income quintile": {
//         metadata: {
//             id: "12",
//             filterByCountry: true,
//             chartName: "Unmet need for health care due to cost, distance and waiting time by income quintile",
//         },
//         data: [
//             {
//                 countryId: "DVnpk4xiXGJ",
//                 image: chart_12_SPA,
//                 dialogInfo: {
//                     infoNotes: [
//                         "Income quintiles are based on the equivalized disposable income of each household member.",
//                     ],
//                     sourceName: "Eurostat (European Union Statistics on Income and Living Conditions)",
//                     sourceLink: "",
//                 },
//             },
//             {
//                 countryId: "AjeCGGb8H76",
//                 image: chart_12_BUL,
//                 dialogInfo: {
//                     infoNotes: [
//                         "Income quintiles are based on the equivalized disposable income of each household member.",
//                     ],
//                     sourceName: "Eurostat (European Union Statistics on Income and Living Conditions)",
//                     sourceLink: "",
//                 },
//             },
//             {
//                 countryId: "KwgjnBBpe5b",
//                 image: chart_12_BEL,
//                 dialogInfo: {
//                     infoNotes: [
//                         "Income quintiles are based on the equivalized disposable income of each household member. Break in series in 2011 and 2019.",
//                     ],
//                     sourceName: "Eurostat (European Union Statistics on Income and Living Conditions)",
//                     sourceLink: "",
//                 },
//             },
//         ],
//     },
//     "Unmet need: Unmet need for dental care due to cost, distance and waiting time by income quintile": {
//         metadata: {
//             id: "13",
//             filterByCountry: true,
//             chartName: "Unmet need for dental care due to cost, distance and waiting time by income quintile",
//         },
//         data: [
//             {
//                 countryId: "DVnpk4xiXGJ",
//                 image: chart_13_SPA,
//                 dialogInfo: {
//                     infoNotes: [
//                         "Income quintiles are based on the equivalized disposable income of each household member.",
//                     ],
//                     sourceName: "Eurostat (European Union Statistics on Income and Living Conditions)",
//                     sourceLink: "",
//                 },
//             },
//             {
//                 countryId: "AjeCGGb8H76",
//                 image: chart_13_BUL,
//                 dialogInfo: {
//                     infoNotes: [
//                         "Income quintiles are based on the equivalized disposable income of each household member.",
//                     ],
//                     sourceName: "Eurostat (European Union Statistics on Income and Living Conditions)",
//                     sourceLink: "",
//                 },
//             },
//             {
//                 countryId: "KwgjnBBpe5b",
//                 image: chart_13_BEL,
//                 dialogInfo: {
//                     infoNotes: [
//                         "Income quintiles are based on the equivalized disposable income of each household member. Break in series in 2011 and 2019.",
//                     ],
//                     sourceName: "Eurostat (European Union Statistics on Income and Living Conditions)",
//                     sourceLink: "",
//                 },
//             },
//         ],
//     },
// };
