import { VisualizationExtra } from "../../../../domain/entities/indicator-explorer/Visualization";
import { chart1Seed } from "./chart1Seed";
import { chart2Seed } from "./chart2Seed";
import { chart3Seed } from "./chart3Seed";
import { chart4Seed } from "./chart4Seed";
import { chart5Seed } from "./chart5Seed";
import { chart6Seed } from "./chart6Seed";
import { chart7Seed } from "./chart7Seed";

export const emptyVisualizationExtra = {
    categoryName: "",
    friendlyName: "",
    info: {
        infoNotes: [],
        sourceName: "",
        sourceLink: "",
    },
};

export const VisualizationsSeeds: Record<string, VisualizationExtra> = {
    hNU4Lj1xLYO: chart1Seed,
    dbc87Ljw8uN: chart2Seed,
    NOukqSxCI63: chart3Seed,
    B4CnzUqVR3n: chart4Seed,
    GimM6ANOKhd: chart5Seed,
    VB7bdJ8ZXya: chart6Seed,
    mcNfvQaVbfy: chart7Seed,
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
    hpO1ZyFXpCz: {
        categoryName: "Financial hardship",
        friendlyName: "Breakdown of catastrophic health spending by type of care",
        info: {
            infoNotes: [
                "Diagnostic tests include paramedical services. Medical products include non-medicine products and equipment (e.g. nebulizers, hearing aids, glasses and wheelchairs).",
            ],
            sourceName: "WHO Barcelona Office for Health Systems Financing",
            sourceLink: "",
        },
        maxCountryFilter: 1,
    },
    OB4SCQfCzwz: {
        categoryName: "Health Spending ( Health accounts)",
        friendlyName: "Current spending on health per person by financing scheme (NCU)",
        info: {
            infoNotes: [
                "Public refers to transfers from the government budget and social health insurance contributions; it excludes other forms of compulsory pre-payment.",
            ],
            sourceName: "WHO Global Health Expenditure Database",
            sourceLink: "",
        },
        maxCountryFilter: 1,
    },
};
